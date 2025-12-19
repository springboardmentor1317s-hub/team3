import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        const registrations = await Registration.find({ user: id })
            .populate('event')
            .sort({ createdAt: -1 });

        return NextResponse.json({ registrations });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
