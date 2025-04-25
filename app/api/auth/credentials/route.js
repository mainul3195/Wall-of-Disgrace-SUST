import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Admin } from '../../../../models/Admin.js';

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
 * PUT /api/auth/credentials
 * Update admin credentials
 */
export async function PUT(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Check for required fields
    if (!body.username || !body.oldPassword || !body.newPassword) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Username, current password, and new password are required' },
        { status: 400 }
      );
    }
    
    // Find admin by username
    const admin = await Admin.findOne({ username: body.username });
    
    // If no admin is found or old password doesn't match
    if (!admin || !admin.authenticate(body.oldPassword)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid username or current password' },
        { status: 401 }
      );
    }
    
    // Update password
    admin.password = body.newPassword; // This will trigger the virtual setter
    await admin.save();
    
    return NextResponse.json({
      message: 'Admin credentials updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin credentials:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
} 