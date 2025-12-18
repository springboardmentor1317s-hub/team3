import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['registration', 'approval', 'event_update', 'general'],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        relatedEvent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
        relatedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        relatedRegistration: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Registration',
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
