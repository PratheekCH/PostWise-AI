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
    const { brandId, startDate, month, year, topicNiche, goals } = req.body;

    if (!brandId) {
      return res.status(400).json({ message: 'brandId is required' });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const targetMonth = month ? parseInt(month, 10) : start.getMonth() + 1;
    const targetYear = year ? parseInt(year, 10) : start.getFullYear();

    const { useMockStore } = getDBStatus();

    let brand;
    if (useMockStore) {
      const { mockBrands } = require('./brandController');
      brand = mockBrands.find(b => b._id === brandId && b.user === userId);
      if (!brand) {
        brand = {
          _id: brandId,
          brandName: 'Demo Brand',
          name: 'Demo Brand',
          industry: 'Technology',
          targetAudience: 'Creators & Entrepreneurs',
          tone: 'Professional',
          platforms: ['Instagram', 'LinkedIn', 'X'],
        };
      }
    } else {
      brand = await Brand.findOne({ _id: brandId, user: userId });
      if (!brand) {
        return res.status(404).json({ message: 'Selected brand profile not found or unauthorized' });
      }
    }

    // Generate ~30 posts
    const generatedPostsData = await generateCalendarPosts({
      brand,
      startDate: start,
      month: targetMonth,
      year: targetYear,
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const bName = brand.brandName || brand.name || 'Brand';
    const calendarTitle = `${bName} - ${monthNames[targetMonth - 1] || 'Month'} ${targetYear}`;

    if (useMockStore) {
      const calendarId = 'mock_cal_' + Date.now();
      const newCalendar = {
        _id: calendarId,
        user: userId,
        brand: brandId,
        title: calendarTitle,
        month: targetMonth,
        year: targetYear,
        startDate: start,
        topicNiche: topicNiche || brand.industry || '',
        goals: goals || brand.postingGoals || '',
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
        platform: p.platform,
        postType: p.postType,
        idea: p.idea,
        title: p.idea,
        caption: p.caption,
        hashtags: p.hashtags,
        status: p.status,
        createdAt: new Date(),
        updatedAt: new Date(),
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
      startDate: start,
      topicNiche: topicNiche || brand.industry || '',
      goals: goals || brand.postingGoals || '',
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

    const calendars = await Calendar.find({ user: userId }).sort({ createdAt: -1 }).populate('brand', 'brandName name industry tone');
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
      if (!calendar) return res.status(404).json({ message: 'Calendar not found or unauthorized' });
      const posts = mockPosts.filter(p => p.calendar === id && p.user === userId);
      return res.json({ calendar, posts });
    }

    const calendar = await Calendar.findOne({ _id: id, user: userId }).populate('brand');
    if (!calendar) return res.status(404).json({ message: 'Calendar not found or unauthorized' });

    const posts = await Post.find({ calendar: id, user: userId }).sort({ date: 1 });
    return res.json({ calendar, posts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch calendar detail' });
  }
};

exports.exportJSON = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { useMockStore } = getDBStatus();

    let calendar;
    let posts;

    if (useMockStore) {
      calendar = mockCalendars.find(c => c._id === id && c.user === userId);
      if (!calendar) return res.status(404).json({ message: 'Calendar not found' });
      posts = mockPosts.filter(p => p.calendar === id && p.user === userId);
    } else {
      calendar = await Calendar.findOne({ _id: id, user: userId }).populate('brand');
      if (!calendar) return res.status(404).json({ message: 'Calendar not found' });
      posts = await Post.find({ calendar: id, user: userId }).sort({ date: 1 });
    }

    const exportData = {
      calendarTitle: calendar.title,
      month: calendar.month,
      year: calendar.year,
      exportedAt: new Date().toISOString(),
      posts: posts.map(p => ({
        id: p._id,
        date: p.date ? new Date(p.date).toISOString().split('T')[0] : '',
        platform: p.platform,
        postType: p.postType,
        idea: p.idea || p.title,
        caption: p.caption,
        hashtags: p.hashtags,
        status: p.status,
      }))
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="calendar_${id}.json"`);
    return res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to export calendar JSON', error: error.message });
  }
};

exports.exportCSV = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { useMockStore } = getDBStatus();

    let calendar;
    let posts;

    if (useMockStore) {
      calendar = mockCalendars.find(c => c._id === id && c.user === userId);
      if (!calendar) return res.status(404).json({ message: 'Calendar not found' });
      posts = mockPosts.filter(p => p.calendar === id && p.user === userId);
    } else {
      calendar = await Calendar.findOne({ _id: id, user: userId });
      if (!calendar) return res.status(404).json({ message: 'Calendar not found' });
      posts = await Post.find({ calendar: id, user: userId }).sort({ date: 1 });
    }

    const escapeCSV = (str) => {
      if (!str) return '""';
      const escaped = String(str).replace(/"/g, '""');
      return `"${escaped}"`;
    };

    let csvContent = 'Date,Platform,PostType,Idea,Caption,Hashtags,Status\n';

    posts.forEach(p => {
      const dateStr = p.date ? new Date(p.date).toISOString().split('T')[0] : '';
      const platformStr = p.platform || '';
      const postTypeStr = p.postType || '';
      const ideaStr = p.idea || p.title || '';
      const captionStr = p.caption || '';
      const hashtagsStr = Array.isArray(p.hashtags) ? p.hashtags.join(' ') : '';
      const statusStr = p.status || 'draft';

      csvContent += `${escapeCSV(dateStr)},${escapeCSV(platformStr)},${escapeCSV(postTypeStr)},${escapeCSV(ideaStr)},${escapeCSV(captionStr)},${escapeCSV(hashtagsStr)},${escapeCSV(statusStr)}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="calendar_${id}.csv"`);
    return res.send(csvContent);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to export calendar CSV', error: error.message });
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
