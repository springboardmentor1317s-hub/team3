import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    await connectToDatabase();

    // Get token from headers
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return Response.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.id;

    // Fetch user profile
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: user });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();

    // Get token from headers
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return Response.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const userId = decoded.id;

    const body = await req.json();
    const { fullName, interests, skills, profileBio } = body;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullName && { fullName }),
        ...(interests && { interests }),
        ...(skills && { skills }),
        ...(profileBio !== undefined && { profileBio }),
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
