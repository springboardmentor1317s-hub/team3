import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import Registration from '@/models/Registration';
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

    const userId = decoded.id;

    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();

    // User-scoped stats
    const myEvents = await Event.find({ createdBy: userId }).select('_id registeredCount status');
    const myEventIds = myEvents.map(e => e._id);

    const pendingMyEvents = myEvents.filter(e => e.status === 'pending').length;
    const pendingMyRegistrations = await Registration.countDocuments({
      status: 'pending',
      event: { $in: myEventIds }
    });

    const totalMyRegistrations = myEvents.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

    const stats = {
      totalEvents: totalEvents, // Global
      activeUsers: totalUsers, // Global
      totalRegistrations: totalMyRegistrations, // Scoped to admin
      pendingApprovals: pendingMyEvents + pendingMyRegistrations, // Scoped to admin
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
