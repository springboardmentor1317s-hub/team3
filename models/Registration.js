import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        // Timestamp is handled automatically by timestamps option
    },
    { timestamps: true }
);

// Compound index to prevent duplicate registrations
RegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
