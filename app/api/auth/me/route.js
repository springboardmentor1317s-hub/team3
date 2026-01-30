import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
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
        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            return NextResponse.json({ user }, { status: 200 });
        } catch (err) {
            return NextResponse.json(
                { error: 'Not authorized, token failed' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
