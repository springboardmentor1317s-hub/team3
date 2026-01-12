import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Event from '@/models/Event';
import Registration from '@/models/Registration';
import jwt from 'jsonwebtoken';

// POST - Submit a review
export async function POST(request) {
    try {
        await connectDB();

        // Get user from token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
        const userId = decoded.userId || decoded.id; // Handle both userId and id

        console.log('Decoded token:', decoded);
        console.log('User ID:', userId);

        const { eventId, rating, comment, privateFeedback } = await request.json();

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
        }

        // Check if event exists and is completed
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        if (event.status !== 'completed') {
            return NextResponse.json({ error: 'Can only review completed events' }, { status: 400 });
        }

        // Check if user has approved registration
        const registration = await Registration.findOne({
            event: eventId,
            user: userId,
            status: 'approved'
        }).populate('user', 'fullName');

        console.log('Review check - EventId:', eventId, 'UserId:', userId);
        console.log('Registration found:', registration);

        if (!registration) {
            // Check if any registration exists
            const anyReg = await Registration.findOne({ event: eventId, user: userId });
            console.log('Any registration for this user/event:', anyReg);
            return NextResponse.json({ error: 'You must have attended this event to review it' }, { status: 403 });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({ eventId, userId });
        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this event' }, { status: 400 });
        }

        // Create review
        const review = await Review.create({
            eventId,
            userId,
            userName: registration.user.fullName,
            rating,
            comment: comment || '',
            privateFeedback: privateFeedback || ''
        });

        return NextResponse.json({ success: true, review }, { status: 201 });
    } catch (error) {
        console.error('Review submission error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
