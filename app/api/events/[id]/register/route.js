import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// register user for event
export async function POST(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user already registered
    if (event.registeredUsers.includes(userId)) {
      return NextResponse.json(
        { error: 'User already registered for this event' },
        { status: 409 }
      );
    }

    // Check seat availability
    if (event.registeredCount >= event.totalSeats) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }

    if (event.registrationEndDate) {
      const now = new Date();
      const endDate = new Date(event.registrationEndDate);
      // Set to end of day
      endDate.setHours(23, 59, 59, 999);
      if (now > endDate) {
        return NextResponse.json(
          { error: 'Registration is closed for this event' },
          { status: 400 }
        );
      }
    } else if (event.date) {
      // Default: Close at event start time
      try {
        const now = new Date();
        const dateTimeStr = `${event.date}T${event.startTime || event.time || '00:00'}`;
        const eventStart = new Date(dateTimeStr);
        if (!isNaN(eventStart.getTime()) && now > eventStart) {
          return NextResponse.json(
            { error: 'Registration is closed (Event has started)' },
            { status: 400 }
          );
        }
      } catch (e) {
        // ignore date parsing error, keep open
      }
    }



    // register user
    event.registeredUsers.push(userId);
    event.registeredCount += 1;
    await event.save();

    // Add event to user's registered events
    await User.findByIdAndUpdate(userId, {
      $push: { registeredEvents: id },
    });

    return NextResponse.json(
      {
        message: 'Successfully registered for event',
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Register event error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Unregister user from event
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Remove user from event
    event.registeredUsers = event.registeredUsers.filter(
      (uid) => uid.toString() !== userId
    );
    event.registeredCount = Math.max(0, event.registeredCount - 1);
    await event.save();

    // Remove event from user's registered events
    await User.findByIdAndUpdate(userId, {
      $pull: { registeredEvents: id },
    });

    return NextResponse.json(
      {
        message: 'Successfully unregistered from event',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unregister event error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
