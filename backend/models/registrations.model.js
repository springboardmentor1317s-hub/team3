import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending"
    }
  },
  {
    timestamps: {
      createdAt: "timestamp",
      updatedAt: false
    }
  }
);

export default mongoose.model("Registration", registrationSchema);
