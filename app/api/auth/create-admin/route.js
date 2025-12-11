import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();

    const { fullName, email, password, college, adminKey } = await request.json();

    // Simple admin key check
    if (adminKey !== 'admin69') {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 403 });
    }

    // Create admin
    const admin = await User.create({
      fullName,
      email,
      password,
      college,
      role: 'admin',
    });

    return NextResponse.json(
      {
        message: 'Admin created successfully',
        admin: {
          id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'Error creating admin' }, { status: 500 });
  }
}
