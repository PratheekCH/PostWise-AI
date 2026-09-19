const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Brand name is required'],
      trim: true,
    },
    industry: {
      type: String,
      default: 'General',
    },
    targetAudience: {
      type: String,
      default: 'General Audience',
    },
    tone: {
      type: String,
      enum: ['Professional', 'Witty & Fun', 'Inspirational', 'Educational', 'Bold & Direct', 'Casual'],
      default: 'Professional',
    },
    platforms: {
      type: [String],
      default: ['Instagram', 'LinkedIn', 'X/Twitter'],
    },
    keywords: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', BrandSchema);
