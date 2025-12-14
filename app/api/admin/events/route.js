import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

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

    const { title, description, category, date, time, location, college, totalSeats, createdBy, registrationStartDate, registrationEndDate } = await request.json();

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      college,
      totalSeats: totalSeats || 100,
      createdBy,
      status: 'active',
      registrationStartDate,
      registrationEndDate,
    });

    return NextResponse.json({ message: 'Event created', event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
