const Calendar = require('../models/Calendar');
const Post = require('../models/Post');
const Brand = require('../models/Brand');
const { generateCalendarPosts } = require('../services/aiService');
const { getDBStatus } = require('../config/db');

const mockCalendars = [];
const mockPosts = [];

exports.generateCalendar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { brandId, month, year, topicNiche, goals, postFrequency } = req.body;

    if (!brandId || !month || !year) {
      return res.status(400).json({ message: 'brandId, month, and year are required' });
    }

    const targetMonth = parseInt(month, 10);
    const targetYear = parseInt(year, 10);

    const { useMockStore } = getDBStatus();

    let brand;
    if (useMockStore) {
      const { mockBrands } = require('./brandController');
      brand = mockBrands.find(b => b._id === brandId && b.user === userId);
      if (!brand) {
        brand = {
          _id: brandId,
          name: 'Demo Brand',
          industry: 'Technology',
          targetAudience: 'Creators & Entrepreneurs',
          tone: 'Professional',
          platforms: ['Instagram', 'LinkedIn', 'X/Twitter'],
          keywords: ['innovation', 'growth'],
        };
      }
    } else {
      brand = await Brand.findOne({ _id: brandId, user: userId });
      if (!brand) {
        return res.status(404).json({ message: 'Selected brand profile not found' });
      }
    }

    // Call AI Service
    const generatedPostsData = await generateCalendarPosts({
      brand,
      month: targetMonth,
      year: targetYear,
      topicNiche: topicNiche || brand.industry,
      goals: goals || 'Brand Growth & Engagement',
      postFrequency: postFrequency || 'daily',
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const calendarTitle = `${brand.name} - ${monthNames[targetMonth - 1] || 'Month'} ${targetYear}`;

    if (useMockStore) {
      const calendarId = 'mock_cal_' + Date.now();
      const newCalendar = {
        _id: calendarId,
        user: userId,
        brand: brandId,
        title: calendarTitle,
        month: targetMonth,
        year: targetYear,
        topicNiche: topicNiche || '',
        goals: goals || '',
        postsCount: generatedPostsData.length,
        createdAt: new Date(),
      };
      mockCalendars.push(newCalendar);

      const createdPosts = generatedPostsData.map((p, idx) => ({
        _id: `mock_post_${Date.now()}_${idx}`,
        calendar: calendarId,
        user: userId,
        brand: brandId,
        date: p.date,
        timeSlot: p.timeSlot,
        platform: p.platform,
        title: p.title,
        caption: p.caption,
        hashtags: p.hashtags,
        postType: p.postType,
        imagePrompt: p.imagePrompt,
        engagementTip: p.engagementTip,
        status: p.status,
        createdAt: new Date(),
      }));

      mockPosts.push(...createdPosts);

      return res.status(201).json({
        message: 'AI Content Calendar generated successfully',
        calendar: newCalendar,
        posts: createdPosts,
      });
    }

    const calendar = await Calendar.create({
      user: userId,
      brand: brandId,
      title: calendarTitle,
      month: targetMonth,
      year: targetYear,
      topicNiche: topicNiche || '',
      goals: goals || '',
      postsCount: generatedPostsData.length,
    });

    const postsToInsert = generatedPostsData.map(p => ({
      ...p,
      calendar: calendar._id,
      user: userId,
      brand: brandId,
    }));

    const createdPosts = await Post.insertMany(postsToInsert);

    return res.status(201).json({
      message: 'AI Content Calendar generated successfully',
      calendar,
      posts: createdPosts,
    });
  } catch (error) {
    console.error('Calendar Generation Error:', error);
    return res.status(500).json({ message: 'Failed to generate content calendar', error: error.message });
  }
};

exports.getCalendars = async (req, res) => {
  try {
    const userId = req.user.id;
    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const userCals = mockCalendars.filter(c => c.user === userId);
      return res.json({ calendars: userCals });
    }

    const calendars = await Calendar.find({ user: userId }).sort({ createdAt: -1 }).populate('brand', 'name industry tone');
    return res.json({ calendars });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch calendars' });
  }
};

exports.getCalendarById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const calendar = mockCalendars.find(c => c._id === id && c.user === userId);
      if (!calendar) return res.status(404).json({ message: 'Calendar not found' });
      const posts = mockPosts.filter(p => p.calendar === id && p.user === userId);
      return res.json({ calendar, posts });
    }

    const calendar = await Calendar.findOne({ _id: id, user: userId }).populate('brand');
    if (!calendar) return res.status(404).json({ message: 'Calendar not found' });

    const posts = await Post.find({ calendar: id, user: userId }).sort({ date: 1 });
    return res.json({ calendar, posts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch calendar detail' });
  }
};

exports.deleteCalendar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const index = mockCalendars.findIndex(c => c._id === id && c.user === userId);
      if (index === -1) return res.status(404).json({ message: 'Calendar not found' });
      mockCalendars.splice(index, 1);

      // delete posts
      for (let i = mockPosts.length - 1; i >= 0; i--) {
        if (mockPosts[i].calendar === id) mockPosts.splice(i, 1);
      }
      return res.json({ message: 'Calendar deleted successfully' });
    }

    const calendar = await Calendar.findOneAndDelete({ _id: id, user: userId });
    if (!calendar) return res.status(404).json({ message: 'Calendar not found' });

    await Post.deleteMany({ calendar: id, user: userId });
    return res.json({ message: 'Calendar deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete calendar' });
  }
};

exports.mockCalendars = mockCalendars;
exports.mockPosts = mockPosts;
