import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Admin, initializeDefaultAdmin } from '../../../models/Admin.js';

// Connect to MongoDB once
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
    
    // Initialize default admin if needed
    await initializeDefaultAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

/**
 * POST /api/auth
 * Authenticates an admin
 */
export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Check for required fields
    if (!body.username || !body.password) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Find admin by username
    const admin = await Admin.findOne({ username: body.username });
    
    // If no admin is found or password doesn't match
    if (!admin || !admin.authenticate(body.password)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Authentication successful
    return NextResponse.json({
      message: 'Authentication successful',
      user: {
        username: admin.username,
        id: admin._id
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
} 