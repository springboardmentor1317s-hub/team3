import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    // Auto-complete past events
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    await Event.updateMany(
      { status: 'active', date: { $lt: currentDate } },
      { $set: { status: 'completed' } }
    );

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

    const { title, description, category, date, time, location, college, totalSeats, createdBy, registrationStartDate, registrationEndDate, teamSizeMin, teamSizeMax, image } = await request.json();

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
      createdBy,
      status: 'active',
      registrationStartDate: registrationStartDate || undefined,
      registrationEndDate: registrationEndDate || undefined,
      image: image || undefined, // Use provided image or let schema default handle it
    });

    return NextResponse.json({ message: 'Event created', event }, { status: 201 });
  } catch (error) {
    console.error("Event creation failed:", error); // Added logging
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
