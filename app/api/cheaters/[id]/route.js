import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Cheater, Evidence } from '../../../../models/Cheater';

/**
 * Database connection state tracker
 * This boolean flag keeps track of whether we've already established a MongoDB connection
 * Initially set to false, indicating no connection has been made yet
 */
let isConnected = false;

/**
 * Database connection function
 * This asynchronous function manages the connection to MongoDB
 * It implements connection pooling by reusing an existing connection if available
 */
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
 * GET API Handler for individual cheater retrieval
 * This function handles HTTP GET requests to the /api/cheaters/[id] endpoint
 * It provides a way to fetch a specific cheater record by its unique ID
 * 
 * @param {Request} request - The incoming HTTP request object containing headers, method, etc.
 * @param {Object} context - Next.js context object containing route parameters and other data
 * @returns {NextResponse} - A JSON response containing the cheater and evidence data or an error
 */
export async function GET(request, context) {
  try {
    await connectToDatabase();
    
    const params = await context.params;
    const id = params.id;
    
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const cheater = await Cheater.findOne({ id: numericId }).lean();
    
    if (!cheater) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Cheater not found' },
        { status: 404 }
      );
    }
    
    const evidence = await Evidence.findOne({ id: cheater.evidence }).lean();
    
    return NextResponse.json({ cheater, evidence });
  } catch (error) {
    console.error('Error fetching cheater:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT API Handler for updating cheater information
 * This function handles HTTP PUT requests to the /api/cheaters/[id] endpoint
 * It allows updating both the cheater data and their associated evidence
 * 
 * @param {Request} request - The incoming HTTP request object containing the update data in JSON format
 * @param {Object} context - Next.js context object containing route parameters
 * @returns {NextResponse} - A JSON response containing the updated data or an error message
 */
export async function PUT(request, context) {
  try {
    await connectToDatabase();
    
    const params = await context.params;
    const id = params.id;
    
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    let updatedCheater, updatedEvidence;
    
    if (body.cheater) {
      updatedCheater = await Cheater.findOneAndUpdate(
        { id: numericId },
        body.cheater,
        { new: true, runValidators: true }
      );
      
      if (!updatedCheater) {
        return NextResponse.json(
          { error: 'Not Found', message: 'Cheater not found' },
          { status: 404 }
        );
      }
    }
    
    if (body.evidence && updatedCheater) {
      updatedEvidence = await Evidence.findOneAndUpdate(
        { id: updatedCheater.evidence },
        body.evidence,
        { new: true, runValidators: true }
      );
    }
    
    return NextResponse.json({
      message: 'Cheater updated successfully',
      cheater: updatedCheater,
      evidence: updatedEvidence
    });
  } catch (error) {
    console.error('Error updating cheater:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation Error', message: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE API Handler for removing cheater records
 * This function handles HTTP DELETE requests to the /api/cheaters/[id] endpoint
 * It deletes both the cheater record and its associated evidence
 * 
 * @param {Request} request - The incoming HTTP request object
 * @param {Object} context - Next.js context object containing route parameters
 * @returns {NextResponse} - A JSON response confirming deletion or describing an error
 */
export async function DELETE(request, context) {
  try {
    await connectToDatabase();
    
    const params = await context.params;
    const id = params.id;
    
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const cheater = await Cheater.findOne({ id: numericId });
    
    if (!cheater) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Cheater not found' },
        { status: 404 }
      );
    }
    
    const evidenceId = cheater.evidence;
    
    await Cheater.deleteOne({ id: numericId });
    
    await Evidence.deleteOne({ id: evidenceId });
    
    return NextResponse.json({
      message: 'Cheater and associated evidence deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cheater:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
} 