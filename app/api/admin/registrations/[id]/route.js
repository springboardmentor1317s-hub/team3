import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const { status } = await request.json();

        const registration = await Registration.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!registration) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Registration updated', registration });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
