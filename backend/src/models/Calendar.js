const mongoose = require('mongoose');

const CalendarSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
      required: [true, 'Calendar title is required'],
    },
    month: {
      type: Number, // 1 - 12
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    topicNiche: {
      type: String,
      default: '',
    },
    goals: {
      type: String,
      default: 'Brand growth & engagement',
    },
    postsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual alias brandId <-> brand
CalendarSchema.virtual('brandId').get(function () {
  return this.brand;
});

CalendarSchema.set('toJSON', { virtuals: true });
CalendarSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Calendar', CalendarSchema);
