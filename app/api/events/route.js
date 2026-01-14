import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

// GET all events
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('createdBy', 'fullName college')
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        message: 'Events retrieved successfully',
        events,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new event (admin only)
export async function POST(request) {
  try {
    await connectDB();

    const { title, description, category, date, time, location, college, image, totalSeats, createdBy } = await request.json();

    // Validation
    if (!title || !description || !category || !date || !time || !location || !college || !createdBy) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      college,
      image: image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop',
      totalSeats: totalSeats || 100,
      createdBy,
    });

    return NextResponse.json(
      {
        message: 'Event created successfully',
        event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
