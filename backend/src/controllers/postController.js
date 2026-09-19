const Post = require('../models/Post');
const Brand = require('../models/Brand');
const { regenerateSinglePost } = require('../services/aiService');
const { getDBStatus } = require('../config/db');

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { calendarId, brandId, date, timeSlot, platform, postType, idea, title, caption, hashtags, status } = req.body;

    const finalIdea = idea || title;
    if (!calendarId || !brandId || !date || !finalIdea || !caption || !platform) {
      return res.status(400).json({ message: 'calendarId, brandId, date, idea, caption, and platform are required' });
    }

    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const { mockPosts } = require('./calendarController');
      const newPost = {
        _id: 'mock_post_' + Date.now(),
        calendar: calendarId,
        user: userId,
        brand: brandId,
        date: new Date(date),
        timeSlot: timeSlot || '09:00 AM',
        platform,
        postType: postType || 'Educational',
        idea: finalIdea,
        title: finalIdea,
        caption,
        hashtags: Array.isArray(hashtags) ? hashtags : (typeof hashtags === 'string' ? hashtags.split(',').map(h => h.trim()) : []),
        status: status || 'draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPosts.push(newPost);
      return res.status(201).json({ message: 'Post created', post: newPost });
    }

    const formattedHashtags = Array.isArray(hashtags)
      ? hashtags
      : typeof hashtags === 'string' ? hashtags.split(',').map(h => h.trim()).filter(Boolean) : [];

    const post = await Post.create({
      calendar: calendarId,
      user: userId,
      brand: brandId,
      date: new Date(date),
      timeSlot: timeSlot || '09:00 AM',
      platform,
      postType: postType || 'Educational',
      idea: finalIdea,
      caption,
      hashtags: formattedHashtags,
      status: status || 'draft',
    });

    return res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { idea, title, caption, hashtags, platform, timeSlot, status, postType, date } = req.body;

    const { useMockStore } = getDBStatus();
    const finalIdea = idea || title;

    if (useMockStore) {
      const { mockPosts } = require('./calendarController');
      const index = mockPosts.findIndex(p => p._id === id && p.user === userId);
      if (index === -1) return res.status(404).json({ message: 'Post not found or unauthorized' });

      mockPosts[index] = {
        ...mockPosts[index],
        idea: finalIdea || mockPosts[index].idea,
        title: finalIdea || mockPosts[index].title,
        caption: caption || mockPosts[index].caption,
        hashtags: Array.isArray(hashtags) ? hashtags : (typeof hashtags === 'string' ? hashtags.split(',').map(h => h.trim()) : mockPosts[index].hashtags),
        platform: platform || mockPosts[index].platform,
        timeSlot: timeSlot || mockPosts[index].timeSlot,
        status: status || mockPosts[index].status,
        postType: postType || mockPosts[index].postType,
        date: date ? new Date(date) : mockPosts[index].date,
        updatedAt: new Date(),
      };
      return res.json({ message: 'Post updated successfully', post: mockPosts[index] });
    }

    const updateFields = {};
    if (finalIdea !== undefined) {
      updateFields.idea = finalIdea;
    }
    if (caption !== undefined) updateFields.caption = caption;
    if (platform !== undefined) updateFields.platform = platform;
    if (timeSlot !== undefined) updateFields.timeSlot = timeSlot;
    if (status !== undefined) updateFields.status = status;
    if (postType !== undefined) updateFields.postType = postType;
    if (date !== undefined) updateFields.date = new Date(date);
    if (hashtags !== undefined) {
      updateFields.hashtags = Array.isArray(hashtags)
        ? hashtags
        : typeof hashtags === 'string' ? hashtags.split(',').map(h => h.trim()).filter(Boolean) : [];
    }

    const post = await Post.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    return res.json({ message: 'Post updated successfully', post });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update post', error: error.message });
  }
};

exports.regeneratePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { customInstruction } = req.body;

    const { useMockStore } = getDBStatus();

    let post;
    let brand;

    if (useMockStore) {
      const { mockPosts } = require('./calendarController');
      const { mockBrands } = require('./brandController');
      const index = mockPosts.findIndex(p => p._id === id && p.user === userId);
      if (index === -1) return res.status(404).json({ message: 'Post not found or unauthorized' });

      post = mockPosts[index];
      brand = mockBrands.find(b => b._id === post.brand) || { brandName: 'Brand', industry: 'General', tone: 'Professional' };

      const regeneratedData = await regenerateSinglePost({ post, brand, customInstruction });

      mockPosts[index] = {
        ...mockPosts[index],
        idea: regeneratedData.idea,
        title: regeneratedData.idea,
        caption: regeneratedData.caption,
        hashtags: regeneratedData.hashtags,
        updatedAt: new Date(),
      };

      return res.json({ message: 'Post regenerated with AI', post: mockPosts[index] });
    }

    post = await Post.findOne({ _id: id, user: userId });
    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    brand = await Brand.findById(post.brand);
    if (!brand) {
      brand = { brandName: 'Brand', industry: 'General', tone: 'Professional' };
    }

    const regeneratedData = await regenerateSinglePost({ post, brand, customInstruction });

    post.idea = regeneratedData.idea;
    post.caption = regeneratedData.caption;
    post.hashtags = regeneratedData.hashtags;
    await post.save();

    return res.json({ message: 'Post content regenerated successfully', post });
  } catch (error) {
    console.error('Post Regeneration Error:', error);
    return res.status(500).json({ message: 'Failed to regenerate post content', error: error.message });
  }
};

exports.reschedulePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { date, timeSlot } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'date is required for rescheduling' });
    }

    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const { mockPosts } = require('./calendarController');
      const index = mockPosts.findIndex(p => p._id === id && p.user === userId);
      if (index === -1) return res.status(404).json({ message: 'Post not found or unauthorized' });

      mockPosts[index].date = new Date(date);
      if (timeSlot) mockPosts[index].timeSlot = timeSlot;
      mockPosts[index].updatedAt = new Date();

      return res.json({ message: 'Post rescheduled successfully', post: mockPosts[index] });
    }

    const updateObj = { date: new Date(date) };
    if (timeSlot) updateObj.timeSlot = timeSlot;

    const post = await Post.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updateObj },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    return res.json({ message: 'Post rescheduled successfully', post });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to reschedule post', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { useMockStore } = getDBStatus();

    if (useMockStore) {
      const { mockPosts } = require('./calendarController');
      const index = mockPosts.findIndex(p => p._id === id && p.user === userId);
      if (index === -1) return res.status(404).json({ message: 'Post not found or unauthorized' });

      mockPosts.splice(index, 1);
      return res.json({ message: 'Post deleted successfully' });
    }

    const post = await Post.findOneAndDelete({ _id: id, user: userId });
    if (!post) return res.status(404).json({ message: 'Post not found or unauthorized' });

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete post' });
  }
};
