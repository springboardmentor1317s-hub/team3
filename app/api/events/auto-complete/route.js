import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';

// GET - Auto-complete past events
export async function GET() {
    try {
        await connectDB();

        // Get current date/time in IST
        const now = new Date();
        const istDateString = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD

        console.log('=== Auto-Complete Events ===');
        console.log('Current IST Time:', now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

        // 1. Mark events from BEFORE today as completed (Legacy check)
        await Event.updateMany(
            { status: 'active', date: { $lt: istDateString } },
            { $set: { status: 'completed' } }
        );

        // 2. Check events strictly ON today
        const todaysEvents = await Event.find({
            status: 'active',
            date: istDateString
        });

        // Helper to normalize time to HH:mm 24-hour format
        const normalizeTime = (timeStr) => {
            if (!timeStr) return "00:00";
            try {
                // Remove spaces and lowercase
                const cleaned = timeStr.toLowerCase().trim();

                // Check if 12-hour format with am/pm
                if (cleaned.includes('am') || cleaned.includes('pm')) {
                    let [hours, minutes] = cleaned.replace(/[a-z]/g, '').split(':').map(Number);
                    if (!minutes) minutes = 0;

                    if (cleaned.includes('pm') && hours < 12) hours += 12;
                    if (cleaned.includes('am') && hours === 12) hours = 0;

                    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                }

                // Just hour? e.g. "10"
                if (!cleaned.includes(':') && !isNaN(cleaned)) {
                    return `${cleaned.padStart(2, '0')}:00`;
                }

                // Assume 24-hour format or simple HH:mm
                return cleaned.split(':').map(p => p.padStart(2, '0')).join(':');
            } catch (e) {
                return "00:00";
            }
        };

        const completedIds = [];
        todaysEvents.forEach(event => {
            try {
                let eventEnd;

                if (event.endTime) {
                    const normalizedEnd = normalizeTime(event.endTime);
                    eventEnd = new Date(`${event.date}T${normalizedEnd}`);
                } else {
                    const rawStart = event.startTime || event.time || '00:00';
                    const normalizedStart = normalizeTime(rawStart);

                    const eventStart = new Date(`${event.date}T${normalizedStart}`);

                    if (isNaN(eventStart.getTime())) {
                        console.log(`Skipping invalid date for event: ${event.title}`);
                        return;
                    }

                    eventEnd = new Date(eventStart.getTime() + (3 * 60 * 60 * 1000)); // Default 3 hours
                }

                if (!isNaN(eventEnd.getTime()) && now > eventEnd) {
                    completedIds.push(event._id);
                    console.log(`  - Mark Completed: ${event.title} (Ended: ${eventEnd.toLocaleTimeString()})`);
                }
            } catch (e) {
                console.error(`Error processing event ${event.title}:`, e);
            }
        });

        let resultMods = 0;
        if (completedIds.length > 0) {
            const res = await Event.updateMany(
                { _id: { $in: completedIds } },
                { $set: { status: 'completed' } }
            );
            resultMods = res.modifiedCount;
        }

        return NextResponse.json({
            success: true,
            completedToday: resultMods,
            message: `Processed. Today's completed: ${resultMods}`
        });
    } catch (error) {
        console.error('Auto-complete error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
