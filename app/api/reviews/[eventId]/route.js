import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

// GET - Get all reviews for an event
export async function GET(request, { params }) {
    try {
        await connectDB();

        const { eventId } = await params;

        // Get all reviews for this event
        const reviews = await Review.find({ eventId })
            .select('-privateFeedback')
            .sort({ createdAt: -1 })
            .lean();

        // Calculate average rating
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

        return NextResponse.json({
            reviews,
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalReviews
        });
    } catch (error) {
        console.error('Review retrieval error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
