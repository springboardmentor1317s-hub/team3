import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();

    const { fullName, email, password, college, role } = await request.json();

    // Direct insert - no validation
    const user = await User.create({
      fullName,
      email,
      password,
      college,
      role: role || 'student',
    });

    return NextResponse.json(
      {
        message: 'User added successfully',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
