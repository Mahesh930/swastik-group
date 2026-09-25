import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
  luxury: {
    type: String,
    enum: ['More space', 'More privacy', 'More nature', 'More convenience', 'Unspecified'],
    default: 'Unspecified'
  },
  home: {
    type: String,
    enum: ['A greener view', 'A higher floor', 'A better location', 'More room', 'Unspecified'],
    default: 'Unspecified'
  },
  commute: {
    type: String,
    enum: ['Absolutely', 'Maybe', 'Probably not', 'Unspecified'],
    default: 'Unspecified'
  },
  thought: {
    type: String,
    required: [true, 'Thought is required'],
    trim: true,
    maxlength: [180, 'Thought cannot exceed 180 characters']
  },
  author: {
    type: String,
    default: 'A Punekar'
  },
  reactions: {
    heart: { type: Number, default: 0 },
    resonates: { type: Number, default: 0 },
    truePune: { type: Number, default: 0 }
  },
  ipHash: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Preference = mongoose.models.Preference || mongoose.model('Preference', preferenceSchema);
