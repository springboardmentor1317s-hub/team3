import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const { read } = await request.json();

        const notification = await Notification.findByIdAndUpdate(
            id,
            { read },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }

        return NextResponse.json({ notification });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
