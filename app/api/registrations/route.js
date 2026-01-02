import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event';
import User from '@/models/User';
import Notification from '@/models/Notification';

export async function POST(request) {
    try {
        await connectDB();
        const { eventId, userId, teamName, teamMembers } = await request.json();

        // Check if duplicate
        const existing = await Registration.findOne({ event: eventId, user: userId });
        if (existing) {
            return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 });
        }

        // Validate team size if provided
        if (teamMembers && teamMembers.length > 0) {
            const event = await Event.findById(eventId);
            if (event) {
                // Check if registration deadline passed
                if (event.registrationEndDate && new Date() > new Date(event.registrationEndDate)) {
                    return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 });
                }

                // Check event capacity
                if (event.totalSeats && event.registeredCount >= event.totalSeats) {
                    return NextResponse.json({ error: 'Event is fully booked' }, { status: 400 });
                }

                const totalMembers = teamMembers.length + 1; // +1 for the registrar
                if (totalMembers < (event.teamSizeMin || 1) || totalMembers > (event.teamSizeMax || 1)) {
                    return NextResponse.json({
                        error: `Team size must be between ${event.teamSizeMin || 1} and ${event.teamSizeMax || 1} members (including you)`
                    }, { status: 400 });
                }
            }
        } else {
            // Single user registration checks
            const event = await Event.findById(eventId);
            if (event) {
                if (event.registrationEndDate && new Date() > new Date(event.registrationEndDate)) {
                    return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 });
                }
                if (event.totalSeats && event.registeredCount >= event.totalSeats) {
                    return NextResponse.json({ error: 'Event is fully booked' }, { status: 400 });
                }
            }
        }

        const registration = await Registration.create({
            event: eventId,
            user: userId,
            status: 'pending', // Default status
            teamName,
            teamMembers
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

        // Create notification for all admins
        const admins = await User.find({ role: 'admin' });
        const user = await User.findById(userId);
        const event = await Event.findById(eventId);

        const notificationPromises = admins.map(admin =>
            Notification.create({
                recipient: admin._id,
                type: 'registration',
                title: 'New Event Registration',
                message: `${user.fullName} registered for ${event.title}`,
                relatedEvent: eventId,
                relatedUser: userId,
                relatedRegistration: registration._id,
                read: false
            })
        );

        await Promise.all(notificationPromises);

        return NextResponse.json({ message: 'Registration successful', registration }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
