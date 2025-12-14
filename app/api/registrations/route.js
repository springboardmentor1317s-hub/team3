import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event';
import User from '@/models/User';

export async function POST(request) {
    try {
        await connectDB();
        const { eventId, userId } = await request.json();

        // Check if duplicate
        const existing = await Registration.findOne({ event: eventId, user: userId });
        if (existing) {
            return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 });
        }

        const registration = await Registration.create({
            event: eventId,
            user: userId,
            status: 'pending' // Default status
        });

        // Optionally update the simple array counts in Event model for quick analytics
        await Event.findByIdAndUpdate(eventId, {
            $push: { registeredUsers: userId },
            $inc: { registeredCount: 1 }
        });

        // Optionally update User's registered list
        await User.findByIdAndUpdate(userId, {
            $push: { registeredEvents: eventId }
        });

        return NextResponse.json({ message: 'Registration successful', registration }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
