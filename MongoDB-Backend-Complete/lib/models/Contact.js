import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must contain at least 10 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    subject: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['new', 'replied', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
