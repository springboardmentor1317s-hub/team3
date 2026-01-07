import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';
import Event from '@/models/Event';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id: eventId } = await params;

        // 1. Auth Check
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        let userId;
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.id;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 2. Fetch Event (Optional: Check ownership if you want to restrict export to owner)
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // 3. Fetch Registrations
        const registrations = await Registration.find({ event: eventId })
            .populate('user', 'fullName email college')
            .sort({ createdAt: -1 });

        // 4. Generate CSV
        const csvHeaders = ['Registration Date', 'User Name', 'Email', 'College', 'Team Name', 'Team Members', 'Status'];
        const csvRows = registrations.map(reg => {
            const date = new Date(reg.createdAt).toLocaleDateString();
            const userName = reg.user?.fullName || 'N/A';
            const email = reg.user?.email || 'N/A';
            const college = reg.user?.college || 'N/A'; // Assuming user has college
            const teamName = reg.teamName || '';
            const teamMembers = reg.teamMembers ? reg.teamMembers.join('; ') : '';
            const status = reg.status;

            // Escape quotes and wrap in quotes for CSV safety
            const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;

            return [
                escape(date),
                escape(userName),
                escape(email),
                escape(college),
                escape(teamName),
                escape(teamMembers),
                escape(status)
            ].join(',');
        });

        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

        // 5. Return CSV Response
        const filename = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_registrations.csv`;

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error('Export CSV Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
