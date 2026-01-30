import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        await connectDB();
        const { userId } = await request.json();

        if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

        const eventName = "Hackverse";
        const result = await Event.updateOne(
            { title: { $regex: eventName, $options: 'i' } },
            { $set: { createdBy: userId } }
        );

        return NextResponse.json({
            message: 'Event updated',
            result
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        await connectDB();
        const eventName = "Hackverse";
        const events = await Event.find({ title: { $regex: eventName, $options: 'i' } });

        const results = [];

        for (const event of events) {
            let creatorId = event.createdBy;
            if (typeof creatorId === 'object' && creatorId?._id) {
                creatorId = creatorId._id.toString();
            } else if (creatorId) {
                creatorId = creatorId.toString();
            }

            const user = creatorId ? await User.findById(creatorId) : null;

            results.push({
                eventId: event._id,
                title: event.title,
                creatorId: creatorId,
                creatorName: user ? user.fullName : 'Unknown/Deleted',
                creatorEmail: user ? user.email : 'N/A'
            });
        }

        const srushtiUsers = await User.find({ fullName: { $regex: 'Srushti', $options: 'i' } });

        return NextResponse.json({
            events: results,
            currentUsers: srushtiUsers.map(u => ({ id: u._id, name: u.fullName, email: u.email }))
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
