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
    const pendingEvents = await Event.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();
    const pendingRegistrations = await Registration.countDocuments({ status: 'pending' });
    const totalRegistrations = await Event.aggregate([
      { $group: { _id: null, total: { $sum: '$registeredCount' } } }
    ]);

    const stats = {
      totalEvents: totalEvents,
      activeUsers: totalUsers,
      totalRegistrations: totalRegistrations[0]?.total || 0,
      pendingApprovals: pendingEvents + pendingRegistrations,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
