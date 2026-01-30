import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

// GET - Get reviews for admin's events
export async function GET(request) {
    try {
        await connectDB();

        // Get user from token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
        const userId = decoded.userId || decoded.id;

        // Fetch events created by this admin
        const myEvents = await Event.find({ createdBy: userId }).select('_id');
        const myEventIds = myEvents.map(event => event._id);

        if (myEventIds.length === 0) {
            return NextResponse.json({ reviews: [] });
        }

        // Fetch reviews for these events (including privateFeedback)
        const reviews = await Review.find({ eventId: { $in: myEventIds } })
            .populate('eventId', 'title image') // Populate event details
            .sort({ createdAt: -1 });

        return NextResponse.json({ reviews });
    } catch (error) {
        console.error('Admin reviews retrieval error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
