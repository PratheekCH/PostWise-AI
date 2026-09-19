import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calendarAPI, postAPI } from '../services/api';
import CalendarGrid from '../components/CalendarGrid';
import PostEditorModal from '../components/PostEditorModal';
import { Calendar as CalendarIcon, Sparkles, ChevronLeft, ChevronRight, Download, List, Grid, Plus, Clock, FileText } from 'lucide-react';

const ContentCalendar = ({ selectedCalendarId, onOpenAiGenerator }) => {
  const { activeBrand, showToast } = useAuth();

  const currentDate = new Date();
  const [calendars, setCalendars] = useState([]);
  const [activeCalendar, setActiveCalendar] = useState(null);
  const [posts, setPosts] = useState([]);

  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCalendarsList = async () => {
    try {
      const res = await calendarAPI.getCalendars();
      const list = res.data.calendars || [];
      setCalendars(list);

      if (selectedCalendarId) {
        const match = list.find((c) => c._id === selectedCalendarId);
        if (match) {
          loadCalendarDetails(match._id);
          return;
        }
      }

      if (list.length > 0) {
        loadCalendarDetails(list[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch calendars list:', err);
    }
  };

  const loadCalendarDetails = async (calId) => {
    setLoading(true);
    try {
      const res = await calendarAPI.getCalendarById(calId);
      setActiveCalendar(res.data.calendar);
      setPosts(res.data.posts || []);
      if (res.data.calendar) {
        setMonth(res.data.calendar.month);
        setYear(res.data.calendar.year);
      }
    } catch (err) {
      showToast('Failed to load calendar details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarsList();
  }, [selectedCalendarId]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  const handlePostDeleted = (deletedId) => {
    setPosts(posts.filter((p) => p._id !== deletedId));
  };

  const handleAddPostAtDate = async (targetDateStr) => {
    if (!activeCalendar) {
      showToast('Please select or generate a calendar first', 'error');
      return;
    }
    try {
      const res = await postAPI.createPost({
        calendarId: activeCalendar._id,
        brandId: activeCalendar.brand._id || activeCalendar.brand,
        date: targetDateStr,
        timeSlot: '10:00 AM',
        platform: activeBrand?.platforms[0] || 'Instagram',
        title: 'New Social Post',
        caption: 'Write caption for this post...',
        hashtags: ['#PostWise'],
        postType: 'Single Image',
        status: 'draft',
      });
      setPosts([...posts, res.data.post]);
      setEditingPost(res.data.post);
      showToast('New post created!', 'success');
    } catch (err) {
      showToast('Failed to create post', 'error');
    }
  };

  const handleExportJSON = () => {
    if (posts.length === 0) {
      showToast('No posts to export', 'info');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(posts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PostWise_Calendar_${month}_${year}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Calendar exported as JSON', 'success');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="page-wrapper">
      {/* Top Bar Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Social Content Calendar</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            {activeCalendar ? activeCalendar.title : 'Select or generate an AI calendar'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '0.25rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                background: viewMode === 'grid' ? '#6366f1' : 'transparent',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Grid size={16} /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                background: viewMode === 'list' ? '#6366f1' : 'transparent',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <List size={16} /> List
            </button>
          </div>

          <button onClick={handleExportJSON} className="btn btn-secondary">
            <Download size={16} />
            <span>Export JSON</span>
          </button>

          <button onClick={onOpenAiGenerator} className="btn btn-gradient">
            <Sparkles size={16} />
            <span>New AI Calendar</span>
          </button>
        </div>
      </div>

      {/* Calendar Switcher & Month Navigation Header */}
      <div
        className="glass-card"
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1rem 1.5rem',
        }}
      >
        {/* Calendar Dropdown Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <CalendarIcon size={20} color="#ec4899" />
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '260px', padding: '0.5rem 1rem' }}
            value={activeCalendar ? activeCalendar._id : ''}
            onChange={(e) => loadCalendarDetails(e.target.value)}
          >
            {calendars.length === 0 ? (
              <option value="">No Calendars Available</option>
            ) : (
              calendars.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.postsCount} posts)
                </option>
              ))
            )}
          </select>
        </div>

        {/* Month Stepper Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={handlePrevMonth} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, minWidth: '180px', textAlign: 'center', color: '#f8fafc' }}>
            {monthNames[month - 1]} {year}
          </span>
          <button onClick={handleNextMonth} className="btn btn-secondary btn-sm" style={{ padding: '0.5rem' }}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main View Container */}
      {loading ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading content posts...
        </div>
      ) : viewMode === 'grid' ? (
        <CalendarGrid
          month={month}
          year={year}
          posts={posts}
          onSelectPost={(post) => setEditingPost(post)}
          onAddPostAtDate={handleAddPostAtDate}
          onPostRescheduled={handlePostUpdated}
        />
      ) : (
        /* List View */
        <div className="glass-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {posts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                No posts found for this month in list view.
              </div>
            ) : (
              posts.map((p) => {
                const dateFormatted = p.date ? new Date(p.date).toLocaleDateString() : '';
                return (
                  <div
                    key={p._id}
                    onClick={() => setEditingPost(p)}
                    style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className={`platform-badge platform-${p.platform.replace(/[^a-zA-Z]/g, '')}`}>
                        {p.platform}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#f8fafc' }}>{p.title}</div>
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem', display: 'flex', gap: '0.8rem' }}>
                          <span>📅 {dateFormatted}</span>
                          <span>⏰ {p.timeSlot || '09:00 AM'}</span>
                          <span>• Format: {p.postType}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className={`status-badge status-${p.status}`}>{p.status}</span>
                      <button className="btn btn-secondary btn-sm">Edit Post</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Post Editor & Regeneration Modal */}
      <PostEditorModal
        post={editingPost}
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        onPostUpdated={handlePostUpdated}
        onPostDeleted={handlePostDeleted}
      />
    </div>
  );
};

export default ContentCalendar;
