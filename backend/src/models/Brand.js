const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brandName: {
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
    postingGoals: {
      type: String,
      default: 'Brand awareness & engagement',
    },
    platforms: {
      type: [String],
      default: ['Instagram', 'LinkedIn', 'X'],
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

// Virtual alias for backward compatibility (name <-> brandName)
BrandSchema.virtual('name').get(function () {
  return this.brandName;
}).set(function (v) {
  this.brandName = v;
});

BrandSchema.set('toJSON', { virtuals: true });
BrandSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Brand', BrandSchema);
