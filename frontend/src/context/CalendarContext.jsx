import React, { createContext, useContext, useState, useEffect } from 'react';
import { calendarAPI, postAPI } from '../services/api';
import { INITIAL_CALENDAR, INITIAL_POSTS } from '../services/mockData';
import { exportToCSV, exportToJSON, exportToPDF } from '../services/exportService';
import { useAuth } from './AuthContext';

const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
  const { showToast, activeBrand } = useAuth();

  const [calendars, setCalendars] = useState([]);
  const [activeCalendar, setActiveCalendar] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filters & View state
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'agenda'

  // Selected post for modal editing
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Load calendars and posts
  const loadCalendars = async () => {
    setLoading(true);
    try {
      const res = await calendarAPI.getCalendars();
      const list = res?.data?.calendars || res?.calendars || res || [INITIAL_CALENDAR];
      setCalendars(list);

      if (list.length > 0) {
        const initial = list[0];
        setActiveCalendar(initial);
        await loadCalendarPosts(initial._id);
      }
    } catch (err) {
      console.warn('Fallback to initial mock calendar', err);
      setCalendars([INITIAL_CALENDAR]);
      setActiveCalendar(INITIAL_CALENDAR);
      setPosts(INITIAL_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarPosts = async (calendarId) => {
    try {
      const res = await calendarAPI.getCalendarById(calendarId);
      const postList = res?.data?.posts || res?.posts || INITIAL_POSTS;
      setPosts(postList);
    } catch (err) {
      console.warn('Fallback to mock posts for calendar', err);
      setPosts(INITIAL_POSTS);
    }
  };

  useEffect(() => {
    loadCalendars();
  }, []);

  const selectCalendar = async (cal) => {
    setActiveCalendar(cal);
    await loadCalendarPosts(cal._id);
    showToast(`Loaded calendar: ${cal.topic || cal.month}`, 'info');
  };

  // Drag and drop reschedule
  const reschedulePost = async (postId, newDate) => {
    try {
      const targetPost = posts.find((p) => p._id === postId);
      if (!targetPost) return;

      const oldDate = targetPost.date;
      if (oldDate === newDate) return;

      // Optimistic UI update
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, date: newDate, status: 'scheduled' } : p))
      );

      await postAPI.reschedulePost(postId, newDate, targetPost.timeSlot);
      showToast(`Rescheduled "${targetPost.title.slice(0, 24)}..." to ${newDate}`, 'success');
    } catch (err) {
      console.error('Failed to reschedule post:', err);
      showToast('Error rescheduling post', 'error');
    }
  };

  // Regenerate single post
  const regeneratePost = async (postId, customInstruction = '') => {
    try {
      const targetPost = posts.find((p) => p._id === postId);
      if (!targetPost) return;

      const updated = await postAPI.regeneratePost(postId, customInstruction);
      setPosts((prev) => prev.map((p) => (p._id === postId ? updated : p)));
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(updated);
      }
      showToast(`Regenerated post for ${targetPost.platform}!`, 'success');
      return updated;
    } catch (err) {
      console.error('Regeneration error:', err);
      showToast('Failed to regenerate post', 'error');
    }
  };

  // Update post
  const updatePost = async (postId, data) => {
    try {
      const updated = await postAPI.updatePost(postId, data);
      setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, ...data } : p)));
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost((prev) => ({ ...prev, ...data }));
      }
      showToast('Post updated successfully', 'success');
      return updated;
    } catch (err) {
      console.error('Update error:', err);
      showToast('Failed to save changes', 'error');
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      await postAPI.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      if (selectedPost && selectedPost._id === postId) {
        setIsEditorOpen(false);
        setSelectedPost(null);
      }
      showToast('Post deleted', 'info');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete post', 'error');
    }
  };

  // Create manual post
  const createPost = async (newPostData) => {
    try {
      const payload = {
        ...newPostData,
        calendar: activeCalendar?._id || 'cal_demo_1',
        brand: activeBrand?._id || 'brand_ecoglow_1',
      };
      const created = await postAPI.createPost(payload);
      setPosts((prev) => [created, ...prev]);
      showToast('New post added to calendar!', 'success');
      return created;
    } catch (err) {
      console.error('Create error:', err);
      showToast('Failed to create post', 'error');
    }
  };

  // Generate new 30-day calendar with AI
  const generateNewCalendar = async (formData) => {
    setIsGenerating(true);
    try {
      const res = await calendarAPI.generateCalendar({
        ...formData,
        brandId: formData.brandId || activeBrand?._id,
      });

      const newCal = res?.calendar || res?.data?.calendar;
      const newPosts = res?.posts || res?.data?.posts || [];

      setCalendars((prev) => [newCal, ...prev]);
      setActiveCalendar(newCal);
      setPosts(newPosts);
      showToast(`Generated 30-day calendar: ${newCal.topic}!`, 'success');
      return { calendar: newCal, posts: newPosts };
    } catch (err) {
      console.error('Generation error:', err);
      showToast('Failed to generate calendar', 'error');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Open / Close Post Editor Modal
  const openPostEditor = (post) => {
    setSelectedPost(post);
    setIsEditorOpen(true);
  };

  const closePostEditor = () => {
    setIsEditorOpen(false);
    setSelectedPost(null);
  };

  // Export handlers
  const handleExport = (format) => {
    if (!posts || posts.length === 0) {
      showToast('No posts to export!', 'error');
      return;
    }
    const calInfo = activeCalendar || { topic: 'Social_Media_Content_Calendar' };

    if (format === 'csv') {
      exportToCSV(posts, calInfo.topic);
      showToast('Downloaded calendar as CSV', 'success');
    } else if (format === 'json') {
      exportToJSON(posts, calInfo);
      showToast('Downloaded calendar as JSON', 'success');
    } else if (format === 'pdf') {
      exportToPDF(posts, calInfo);
      showToast('Downloaded calendar as PDF', 'success');
    }
  };

  // Filtered posts calculation
  const filteredPosts = posts.filter((post) => {
    if (platformFilter !== 'All' && post.platform !== platformFilter) {
      return false;
    }
    if (statusFilter !== 'All' && post.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (post.title || '').toLowerCase().includes(q);
      const matchCaption = (post.caption || '').toLowerCase().includes(q);
      const matchTags = Array.isArray(post.hashtags)
        ? post.hashtags.some((t) => t.toLowerCase().includes(q))
        : false;
      if (!matchTitle && !matchCaption && !matchTags) return false;
    }
    return true;
  });

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        activeCalendar,
        posts,
        filteredPosts,
        loading,
        isGenerating,
        platformFilter,
        statusFilter,
        searchQuery,
        viewMode,
        selectedPost,
        isEditorOpen,
        setPlatformFilter,
        setStatusFilter,
        setSearchQuery,
        setViewMode,
        selectCalendar,
        reschedulePost,
        regeneratePost,
        updatePost,
        deletePost,
        createPost,
        generateNewCalendar,
        openPostEditor,
        closePostEditor,
        handleExport,
        refreshCalendar: loadCalendars,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);
