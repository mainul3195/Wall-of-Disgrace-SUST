import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Cheater, Evidence } from '../../../../models/Cheater.js';

// Database connection state tracker
let isConnected = false;

// Database connection function
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

// GET handler for retrieving a cheater by ID
export async function GET(request, props) {
  const params = await props.params;
  try {
    await connectToDatabase();
    
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

// PUT handler for updating a cheater by ID
export async function PUT(request, props) {
  const params = await props.params;
  try {
    await connectToDatabase();
    
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

// DELETE handler for removing a cheater by ID
export async function DELETE(request, props) {
  const params = await props.params;
  try {
    await connectToDatabase();
    
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