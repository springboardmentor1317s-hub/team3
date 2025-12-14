import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const { eventId } = await request.json();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isFavorite = user.favorites.includes(eventId);
        if (isFavorite) {
            user.favorites = user.favorites.filter(id => id.toString() !== eventId);
        } else {
            user.favorites.push(eventId);
        }

        await user.save();

        return NextResponse.json({
            message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
            favorites: user.favorites
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
