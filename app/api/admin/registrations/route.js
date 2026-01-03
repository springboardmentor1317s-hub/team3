import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event'; // Ensure models are registered
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
    try {
        await connectDB();

        // Get token from header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Not authorized, no token' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { error: 'Not authorized, token failed' },
                { status: 401 }
            );
        }

        const userId = decoded.id;

        // Get events created by this admin
        const adminEvents = await Event.find({ createdBy: userId }).select('_id');

        // Get registrations for those events
        const registrations = await Registration.find({ event: { $in: adminEvents.map(e => e._id) } })
            .populate('event', 'title date')
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ registrations });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
