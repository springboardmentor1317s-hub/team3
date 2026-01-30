import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
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
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        maxlength: 500,
        default: ''
    },
    privateFeedback: {
        type: String,
        maxlength: 1000,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index to ensure one review per user per event
ReviewSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
