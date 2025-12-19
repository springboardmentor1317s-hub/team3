import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

// GET event by ID
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const event = await Event.findById(id)
      .populate('createdBy', 'fullName college')
      .populate('registeredUsers', 'fullName email college');

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Event retrieved successfully',
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// UPDATE event
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const updateData = await request.json();

    const event = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Event updated successfully',
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Event deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
