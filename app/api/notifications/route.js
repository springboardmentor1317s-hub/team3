import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/models/Notification';
import User from '@/models/User';

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        const query = userId ? { recipient: userId } : {};
        if (unreadOnly) {
            query.read = false;
        }

        const notifications = await Notification.find(query)
            .populate('relatedEvent', 'title')
            .populate('relatedUser', 'fullName')
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({ notifications });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        const notification = await Notification.create(body);

        return NextResponse.json({ notification }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
