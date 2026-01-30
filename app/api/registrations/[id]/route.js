import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Handle PUT for Cancellation (Student) or Status Update
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params; // Await params in Next.js 15+ if needed, or just params

        // Auth Check
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        const registration = await Registration.findById(id).populate('event');
        if (!registration) {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        // Check if user owns the registration
        if (registration.user.toString() !== decoded.id) {
            // If not owner, check if admin (optional, but admins usually use /api/admin/...)
            // For now strictly student cancellation
            return NextResponse.json({ error: 'Not authorized to modify this registration' }, { status: 403 });
        }

        if (status === 'cancelled') {
            const eventDate = new Date(registration.event.date);
            const today = new Date();

            // 2 Days check
            const diffTime = eventDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 2) {
                return NextResponse.json({ error: 'Cannot cancel registration within 2 days of the event.' }, { status: 400 });
            }

            // NEW: Hard Delete instead of status 'cancelled'
            await Registration.findByIdAndDelete(id);

            // Update Event count and remove user from array
            await Event.findByIdAndUpdate(registration.event._id, {
                $inc: { registeredCount: -1 },
                $pull: { registeredUsers: registration.user }
            });

            // Also remove from User's registeredEvents if applicable (assuming User model has it)
            // Importing User model first just in case, though it was imported in POST
            const User = (await import('@/models/User')).default;
            await User.findByIdAndUpdate(registration.user, {
                $pull: { registeredEvents: registration.event._id }
            });

            return NextResponse.json({ message: 'Registration cancelled and deleted successfully' });
        }

        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });

    } catch (error) {
        console.error("Cancellation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
