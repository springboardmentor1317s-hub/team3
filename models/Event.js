import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    category: {
      type: String,
      enum: ['Technology', 'Sports', 'Cultural', 'Academic', 'Business', 'Workshop', 'Music', 'Arts', 'Hackathon'],
      required: true,
    },
    tags: {
      type: [String],
      default: []
    },
    date: {
      type: String,
      required: [true, 'Please provide event date'],
    },
    time: {
      type: String, // Kept for backward compatibility or general text
      required: false,
    },
    startTime: {
      type: String,
      required: false, // Make optional initially to not break existing events
    },
    endTime: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    college: {
      type: String,
      required: [true, 'Please provide college name'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop',
    },
    totalSeats: {
      type: Number,
      required: false,
      default: 100,
    },
    teamSizeMin: {
      type: Number,
      default: 1,
      min: 1,
    },
    teamSizeMax: {
      type: Number,
      default: 1,
      min: 1,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'pending'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registrationStartDate: {
      type: Date,
    },
    registrationEndDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
