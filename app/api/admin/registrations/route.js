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
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let userId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Find user details to handle multiple IDs with same email
        const currentUser = await User.findById(userId);
        let myUserIds = [userId];

        if (currentUser && currentUser.email) {
            const usersWithSameEmail = await User.find({ email: currentUser.email }).select('_id');
            myUserIds = usersWithSameEmail.map(u => u._id);
        }

        // Find events created by this admin (or aliases)
        const myEvents = await Event.find({ createdBy: { $in: myUserIds } }).select('_id');
        const myEventIds = myEvents.map(e => e._id);

        // Fetch registrations only for these events
        const registrations = await Registration.find({ event: { $in: myEventIds } })
            .populate({
                path: 'event',
                select: 'title date createdBy', // Fetch createdBy to allow frontend filtering if needed
                populate: { path: 'createdBy', select: 'email' } // Deep populate to support frontend email check
            })
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ registrations });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
