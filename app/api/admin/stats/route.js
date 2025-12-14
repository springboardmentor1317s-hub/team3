import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();
    const totalRegistrations = await Event.aggregate([
      { $group: { _id: null, total: { $sum: '$registeredCount' } } }
    ]);

    const stats = {
      totalEvents: totalEvents,
      activeUsers: totalUsers,
      totalRegistrations: totalRegistrations[0]?.total || 0,
      pendingApprovals: activeEvents,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
