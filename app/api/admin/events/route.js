import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User'; // Ensure User model is registered for populate
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
  try {
    await connectDB();

    // Get token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Not authorized, no token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Not authorized, token failed' },
        { status: 401 }
      );
    }

    // Auto-completion logic removed to prevent premature event closing due to timezone differences.
    // Events should be marked completed manually or via a scheduled job.

    // const today = new Date();
    // const year = today.getFullYear();
    // const month = String(today.getMonth() + 1).padStart(2, '0');
    // const day = String(today.getDate()).padStart(2, '0');
    // const currentDate = `${year}-${month}-${day}`;

    // await Event.updateMany(
    //   { status: 'active', date: { $lt: currentDate } },
    //   { $set: { status: 'completed' } }
    // );

    const events = await Event.find()
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { title, description, category, date, time, location, college, totalSeats, registrationStartDate, registrationEndDate, teamSizeMin, teamSizeMax, image, tags } = await request.json();

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location: location || 'To Be Announced',
      college,
      totalSeats: totalSeats || 100,
      teamSizeMin: teamSizeMin || 1,
      teamSizeMax: teamSizeMax || 1,
      createdBy: userId, // Securely set from token
      status: 'pending',
      registrationStartDate: registrationStartDate || undefined,
      registrationEndDate: registrationEndDate || undefined,
      image: image || undefined,
      tags: tags || [],
    });

    return NextResponse.json({ message: 'Event created', event }, { status: 201 });
  } catch (error) {
    console.error("Event creation failed:", error); // Added logging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
