import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Cheater, Evidence } from '../../../models/Cheater';

// Connect to MongoDB once
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

/**
 * GET /api/cheaters
 * Retrieves all cheaters from the database
 */
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await Cheater.countDocuments();
    
    // Get cheaters with pagination
    const cheaters = await Cheater.find()
      .sort({ id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Return response with pagination metadata
    return NextResponse.json({
      cheaters,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching cheaters:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cheaters
 * Adds a new cheater and evidence to the database
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.cheater || !body.evidence) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Missing cheater or evidence data' },
        { status: 400 }
      );
    }
    
    // Create new evidence document
    const newEvidence = new Evidence(body.evidence);
    
    // Create new cheater document
    const newCheater = new Cheater(body.cheater);
    
    // Save both documents
    await newEvidence.save();
    await newCheater.save();
    
    return NextResponse.json(
      { 
        message: 'Cheater added successfully',
        cheater: newCheater,
        evidence: newEvidence
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding cheater:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation Error', message: error.message },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate Error', message: 'A cheater with this ID already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
} 