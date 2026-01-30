import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    college: {
      type: String,
      required: [true, 'Please provide a college name'],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    availableRoles: {
      type: [String],
      enum: ['student', 'admin'],
      default: function () { return [this.role]; },
    },
    registeredEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    interests: [
      {
        type: String,
      },
    ],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    skills: [
      {
        type: String,
      },
    ],
    profileBio: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
