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
      enum: ['Technology', 'Sports', 'Culture', 'Academic', 'Business', 'Workshop'],
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide event time'],
    },
    location: {
      type: String,
      required: [true, 'Please provide event location'],
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
      required: [true, 'Please provide total seats'],
      default: 100,
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
      required: [true, 'Please provide registration start date'],
    },
    registrationEndDate: {
      type: Date,
      required: [true, 'Please provide registration end date'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
