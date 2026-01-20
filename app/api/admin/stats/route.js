import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import Registration from '@/models/Registration';
import Review from '@/models/Review';
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
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { error: 'Not authorized, token failed' },
        { status: 401 }
      );
    }

    const userId = decoded.id; // Correctly defined now

    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();

    // User-scoped stats
    // User-scoped stats (Multi-ID support)
    const currentUser = await User.findById(userId);
    let myUserIds = [userId];
    if (currentUser && currentUser.email) {
      const usersWithSameEmail = await User.find({ email: currentUser.email }).select('_id');
      myUserIds = usersWithSameEmail.map(u => u._id);
    }

    const myEvents = await Event.find({ createdBy: { $in: myUserIds } }).select('_id registeredCount status');
    const myEventIds = myEvents.map(e => e._id);

    const pendingMyEvents = myEvents.filter(e => e.status === 'pending').length;
    const pendingMyRegistrations = await Registration.countDocuments({
      status: 'pending',
      event: { $in: myEventIds }
    });

    const totalMyRegistrations = myEvents.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

    const reviews = await Review.find({ eventId: { $in: myEventIds } });
    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0";

    // Calculate Average Rating
    // We need to fetch reviews for these events. 
    // Since Review model references 'eventId', and we have 'myEventIds'.
    // NOTE: Need to make sure Review model is imported. 
    // Added Import at top (handled by multi_replace if needed, but here I can just add logic and assume import or add it in a separate block if I can't reach top).
    // Wait, I need to check imports. `Review` is NOT imported in the viewed file content of stats route.
    // I must use multi_replace to add the import as well.

    const stats = {
      totalEvents: myEvents.length, // Scoped to admin
      activeUsers: totalUsers, // Global
      totalRegistrations: totalMyRegistrations, // Scoped to admin
      pendingApprovals: pendingMyEvents + pendingMyRegistrations, // Scoped to admin
      averageRating: avgRating // Added field
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
