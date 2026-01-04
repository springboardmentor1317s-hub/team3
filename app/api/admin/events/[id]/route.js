import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify token
const verifyToken = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Not authorized, no token');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, JWT_SECRET);
};

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const decoded = verifyToken(request);
    const userId = decoded.id;

    const { id } = await params;
    const updateData = await request.json();

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Enforce ownership
    if (event.createdBy.toString() !== userId) {
      return NextResponse.json({ error: 'Not authorized to edit this event' }, { status: 403 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ message: 'Event updated', event: updatedEvent });
  } catch (error) {
    const status = error.message.includes('Not authorized') ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const decoded = verifyToken(request);
    const userId = decoded.id;

    const { id } = await params;

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Enforce ownership
    if (event.createdBy.toString() !== userId) {
      return NextResponse.json({ error: 'Not authorized to delete this event' }, { status: 403 });
    }

    await Event.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Event deleted' });
  } catch (error) {
    const status = error.message.includes('Not authorized') ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
