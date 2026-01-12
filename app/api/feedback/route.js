import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import jwt from 'jsonwebtoken';

// POST - Submit feedback
export async function POST(request) {
    try {
        await connectDB();

        // Get user from token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { eventId, reactionType } = await request.json();

        // Validate reaction type
        const validReactions = ['interesting', 'boring', 'confusing', 'tooFast', 'tooSlow', 'clear'];
        if (!validReactions.includes(reactionType)) {
            return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
        }

        // Create feedback
        const feedback = await Feedback.create({
            eventId,
            userId,
            reactionType,
            timestamp: new Date()
        });

        return NextResponse.json({ success: true, feedback }, { status: 201 });
    } catch (error) {
        console.error('Feedback submission error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
