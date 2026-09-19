import React, { useState } from 'react';
import { Clock, Plus, Filter, Sparkles, Layers } from 'lucide-react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CalendarGrid = ({ month, year, posts, onSelectPost, onAddPostAtDate, onPostRescheduled }) => {
  const { showToast } = useAuth();
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days calculations
  const firstDayIndex = new Date(year, month - 1, 1).getDay();
  const totalDaysInMonth = new Date(year, month, 0).getDate();

  // Create grid cells array
  const gridCells = [];
  // Empty padding cells for start of month
  for (let i = 0; i < firstDayIndex; i++) {
    gridCells.push({ isPadding: true, key: `pad-start-${i}` });
  }
  // Days of month
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const cellDate = new Date(year, month - 1, d);
    gridCells.push({
      isPadding: false,
      dayNumber: d,
      dateObj: cellDate,
      dateStr: cellDate.toISOString().split('T')[0],
      key: `day-${d}`,
    });
  }

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (!post.date) return false;
    const postDate = new Date(post.date);
    if (postDate.getMonth() + 1 !== parseInt(month, 10) || postDate.getFullYear() !== parseInt(year, 10)) {
      return false;
    }

    if (platformFilter !== 'All' && post.platform !== platformFilter) return false;
    if (statusFilter !== 'All' && post.status !== statusFilter) return false;

    return true;
  });

  // Map posts by day number
  const postsByDay = {};
  filteredPosts.forEach((post) => {
    const day = new Date(post.date).getDate();
    if (!postsByDay[day]) postsByDay[day] = [];
    postsByDay[day].push(post);
  });

  // Drag & drop reschedule handlers
  const handleDragStart = (e, post) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ postId: post._id, title: post.title }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetDateStr) => {
    e.preventDefault();
    const dataStr = e.dataTransfer.getData('text/plain');
    if (!dataStr) return;

    try {
      const { postId } = JSON.parse(dataStr);
      const res = await postAPI.reschedulePost(postId, targetDateStr);
      showToast('Post rescheduled!', 'success');
      if (onPostRescheduled) onPostRescheduled(res.data.post);
    } catch (err) {
      showToast('Failed to reschedule post', 'error');
    }
  };

  const isToday = (dayNum) => {
    const today = new Date();
    return (
      today.getDate() === dayNum &&
      today.getMonth() + 1 === parseInt(month, 10) &&
      today.getFullYear() === parseInt(year, 10)
    );
  };

  return (
    <div>
      {/* Calendar Controls & Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '0.85rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Filter size={18} color="#6366f1" />
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>Filters:</span>

          {/* Platform Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="All">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="X/Twitter">X/Twitter</option>
            <option value="TikTok">TikTok</option>
            <option value="Facebook">Facebook</option>
          </select>

          {/* Status Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
          Showing <span style={{ color: '#ec4899', fontWeight: 700 }}>{filteredPosts.length}</span> posts in calendar
        </div>
      </div>

      {/* Grid Headers */}
      <div className="calendar-grid" style={{ marginTop: 0 }}>
        {daysOfWeek.map((day) => (
          <div key={day} className="calendar-header-day">
            {day}
          </div>
        ))}

        {/* Grid Day Cells */}
        {gridCells.map((cell) => {
          if (cell.isPadding) {
            return (
              <div
                key={cell.key}
                style={{
                  background: 'rgba(15, 23, 42, 0.2)',
                  borderRadius: '12px',
                  minHeight: '130px',
                  border: '1px solid rgba(255, 255, 255, 0.02)',
                }}
              />
            );
          }

          const dayPosts = postsByDay[cell.dayNumber] || [];
          const currentIsToday = isToday(cell.dayNumber);

          return (
            <div
              key={cell.key}
              className="calendar-day-cell"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, cell.dateStr)}
            >
              <div className={`calendar-day-number ${currentIsToday ? 'today' : ''}`}>
                <span>{cell.dayNumber}</span>
                <button
                  onClick={() => onAddPostAtDate && onAddPostAtDate(cell.dateStr)}
                  title="Add Post on this day"
                  style={{
                    background: 'none',
                    color: '#64748b',
                    padding: '0.1rem',
                    borderRadius: '4px',
                    display: 'flex',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#6366f1')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Day Posts List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto', flex: 1 }}>
                {dayPosts.map((post) => (
                  <div
                    key={post._id}
                    className="post-tile"
                    draggable
                    onDragStart={(e) => handleDragStart(e, post)}
                    onClick={() => onSelectPost(post)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span className={`platform-badge platform-${post.platform.replace(/[^a-zA-Z]/g, '')}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                        {post.platform}
                      </span>
                      <span className={`status-badge status-${post.status}`} style={{ fontSize: '0.6rem', padding: '0.05rem 0.3rem' }}>
                        {post.status}
                      </span>
                    </div>
                    <div className="post-tile-title">{post.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: '#94a3b8' }}>
                      <Clock size={10} />
                      <span>{post.timeSlot || '09:00 AM'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
