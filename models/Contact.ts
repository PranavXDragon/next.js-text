import mongoose, { Schema, Document } from 'mongoose'

export interface IContact extends Document {
  name: string
  email: string
  subject: string
  message: string
  createdAt: Date
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
      maxlength: [200, 'Subject cannot be more than 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [5000, 'Message cannot be more than 5000 characters'],
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Contact ||
  mongoose.model<IContact>('Contact', contactSchema)
