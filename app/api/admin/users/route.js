import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    if (users.length > 0) {
      // console.log("Sample user data:", JSON.stringify(users[0], null, 2));
    }

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
