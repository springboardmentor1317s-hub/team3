import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    college_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["tech", "cultural", "sports", "seminar", "other"],
      default: "other"
    },

    location: {
      type: String,
      required: true
    },

    start_date: {
      type: Date,
      required: true
    },

    end_date: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false }
  }
);

export default mongoose.model("Event", eventSchema);
