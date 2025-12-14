import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event'; // Ensure models are registered
import User from '@/models/User';

export async function GET(request) {
    try {
        await connectDB();
        const registrations = await Registration.find()
            .populate('event', 'title date')
            .populate('user', 'fullName email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ registrations });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
