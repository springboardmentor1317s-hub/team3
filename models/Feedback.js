import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reactionType: {
        type: String,
        enum: ['interesting', 'boring', 'confusing', 'tooFast', 'tooSlow', 'clear'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
FeedbackSchema.index({ eventId: 1, timestamp: 1 });
FeedbackSchema.index({ eventId: 1, reactionType: 1 });

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
