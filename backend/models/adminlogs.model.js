import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "timestamp",
      updatedAt: false
    }
  }
);

export default mongoose.model("AdminLog", adminLogSchema);
