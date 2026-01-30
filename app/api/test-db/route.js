import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
    try {
        console.log('Test Route: connecting...');
        await connectDB();
        console.log('Test Route: connected!');
        return NextResponse.json({ status: 'Connected to MongoDB' });
    } catch (error) {
        console.error('Test Route: connection failed', error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
