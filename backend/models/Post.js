const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    calendar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Calendar',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      default: '09:00 AM',
    },
    platform: {
      type: String,
      enum: ['Instagram', 'LinkedIn', 'X/Twitter', 'TikTok', 'Facebook', 'YouTube'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    postType: {
      type: String,
      enum: ['Single Image', 'Carousel', 'Reel / Short Video', 'Text Article', 'Poll / Question'],
      default: 'Single Image',
    },
    imagePrompt: {
      type: String,
      default: '',
    },
    engagementTip: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
