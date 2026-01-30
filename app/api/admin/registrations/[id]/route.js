import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request, { params }) {
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
        const { id } = await params;
        const { status } = await request.json();

        // Find the registration and populate the event
        const registration = await Registration.findById(id).populate('event', 'createdBy');

        if (!registration) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        // Check if the event was created by this admin
        if (registration.event.createdBy.toString() !== userId) {
            return NextResponse.json({ error: 'Not authorized to update this registration' }, { status: 403 });
        }

        const updatedRegistration = await Registration.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        return NextResponse.json({ message: 'Registration updated', registration: updatedRegistration });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
