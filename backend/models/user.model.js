import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    college: {
      type: String,
      default: null
    },

    role: {
      type: String,
      enum: ["student", "admin", "organizer"],
      default: "student"
    }
  },
  {
    timestamps: true // for createdAt and UpdatedAt fields
  }
);

export default mongoose.model("User", userSchema);