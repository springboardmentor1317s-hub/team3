import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';

// GET - Auto-complete past events
export async function GET() {
    try {
        await connectDB();

        // Get current date in IST (Asia/Kolkata timezone)
        const now = new Date();
        const istDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD format

        console.log('=== Auto-Complete Events ===');
        console.log('Current IST date:', istDateString);

        // Find events that should be completed (date is before today)
        const eventsToComplete = await Event.find({
            status: 'active',
            date: { $lt: istDateString }
        });

        console.log(`Found ${eventsToComplete.length} events to complete:`);
        eventsToComplete.forEach(e => {
            console.log(`  - ${e.title} (${e.date})`);
        });

        // Update them to completed
        const result = await Event.updateMany(
            {
                status: 'active',
                date: { $lt: istDateString }
            },
            {
                $set: { status: 'completed' }
            }
        );

        console.log(`Successfully updated ${result.modifiedCount} events to completed`);
        console.log('============================');

        return NextResponse.json({
            success: true,
            message: `${result.modifiedCount} events marked as completed`,
            modifiedCount: result.modifiedCount,
            currentDate: istDateString,
            eventsUpdated: eventsToComplete.map(e => ({ title: e.title, date: e.date }))
        });
    } catch (error) {
        console.error('Auto-complete error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
