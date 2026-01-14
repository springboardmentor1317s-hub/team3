import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

// GET - Get feedback for an event (admin only)
export async function GET(request, { params }) {
    try {
        await connectDB();

        // Verify admin
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId || decoded.id;

        const { eventId } = await params;

        // Get event details
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Verify user is the event creator
        const eventCreatorId = event.createdBy?._id || event.createdBy;
        if (String(eventCreatorId) !== String(userId)) {
            return NextResponse.json({ error: 'Unauthorized: Only event creator can view live feedback' }, { status: 403 });
        }

        // Check if event is currently active (between start and end time)
        const now = new Date();
        const eventDate = new Date(event.date);

        // Construct start time
        let eventStart;
        if (event.startTime) {
            const [hours, minutes] = event.startTime.split(':');
            eventStart = new Date(eventDate);
            eventStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else if (event.time) {
            const [hours, minutes] = event.time.split(':');
            eventStart = new Date(eventDate);
            eventStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            eventStart = eventDate;
        }

        // Construct end time
        let eventEnd;
        if (event.endTime) {
            const [hours, minutes] = event.endTime.split(':');
            eventEnd = new Date(eventDate);
            eventEnd.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            // Default to 2 hours after start if no end time specified
            eventEnd = new Date(eventStart);
            eventEnd.setHours(eventEnd.getHours() + 2);
        }

        // Check if current time is within event window
        if (now < eventStart || now > eventEnd) {
            return NextResponse.json({
                error: 'Live feedback is only accessible during the event',
                eventStart: eventStart.toISOString(),
                eventEnd: eventEnd.toISOString()
            }, { status: 403 });
        }

        // Get all feedback for this event
        const feedback = await Feedback.find({ eventId })
            .sort({ timestamp: 1 })
            .lean();

        // Aggregate feedback into 5-minute buckets
        const aggregated = aggregateFeedback(feedback, event);

        return NextResponse.json({
            feedback,
            aggregated,
            event: {
                title: event.title,
                startTime: event.date + ' ' + event.time,
                endTime: event.endTime || event.date + ' ' + event.time
            }
        });
    } catch (error) {
        console.error('Feedback retrieval error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function aggregateFeedback(feedback, event) {
    if (feedback.length === 0) {
        return { timeBuckets: [], insights: null };
    }

    const eventStart = new Date(event.date + ' ' + event.time);
    const bucketSize = 10 * 1000; // 10 seconds in milliseconds
    const buckets = {};

    // Group feedback into 10-sec buckets
    feedback.forEach(f => {
        const elapsed = new Date(f.timestamp) - eventStart;
        const bucketIndex = Math.floor(elapsed / bucketSize);
        const bucketKey = bucketIndex * bucketSize; // milliseconds from start

        if (!buckets[bucketKey]) {
            buckets[bucketKey] = {
                time: bucketKey,
                reactions: {
                    interesting: 0,
                    boring: 0,
                    confusing: 0,
                    tooFast: 0,
                    tooSlow: 0,
                    clear: 0
                }
            };
        }

        buckets[bucketKey].reactions[f.reactionType]++;
    });

    const timeBuckets = Object.values(buckets).sort((a, b) => a.time - b.time);

    // Calculate insights
    const insights = calculateInsights(timeBuckets);

    return { timeBuckets, insights };
}

function calculateInsights(timeBuckets) {
    if (timeBuckets.length === 0) return null;

    let peakEngagement = { time: 0, count: 0 };
    let dropOff = { time: 0, count: 0 };
    let mostConfusing = { time: 0, count: 0 };

    timeBuckets.forEach(bucket => {
        const interesting = bucket.reactions.interesting;
        const boring = bucket.reactions.boring;
        const confusing = bucket.reactions.confusing;

        if (interesting > peakEngagement.count) {
            peakEngagement = { time: bucket.time, count: interesting };
        }

        if (boring > dropOff.count) {
            dropOff = { time: bucket.time, count: boring };
        }

        if (confusing > mostConfusing.count) {
            mostConfusing = { time: bucket.time, count: confusing };
        }
    });

    return {
        peakEngagement,
        dropOff,
        mostConfusing,
        paceIssues: {
            tooFast: timeBuckets.reduce((sum, b) => sum + b.reactions.tooFast, 0),
            tooSlow: timeBuckets.reduce((sum, b) => sum + b.reactions.tooSlow, 0)
        }
    };
}
