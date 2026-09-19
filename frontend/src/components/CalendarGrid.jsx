import React, { useState } from 'react';
import { Clock, Plus, Filter } from 'lucide-react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CalendarGrid = ({ month, year, posts, onSelectPost, onAddPostAtDate, onPostRescheduled }) => {
  const { showToast } = useAuth();
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const targetMonth = parseInt(month, 10);
  const targetYear = parseInt(year, 10);

  // Days calculations
  const firstDayIndex = new Date(targetYear, targetMonth - 1, 1).getDay();
  const totalDaysInMonth = new Date(targetYear, targetMonth, 0).getDate();

  // Helper to format Date as YYYY-MM-DD cleanly regardless of timezone
  const getYYYYMMDD = (d) => {
    if (!d) return '';
    if (typeof d === 'string') {
      return d.split('T')[0];
    }
    const yearStr = d.getFullYear();
    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    return `${yearStr}-${monthStr}-${dayStr}`;
  };

  // Helper to get day number from Date string safely
  const getPostDateParts = (d) => {
    if (!d) return null;
    const str = typeof d === 'string' ? d.split('T')[0] : getYYYYMMDD(d);
    const parts = str.split('-');
    if (parts.length === 3) {
      return {
        year: parseInt(parts[0], 10),
        month: parseInt(parts[1], 10),
        day: parseInt(parts[2], 10),
      };
    }
    const dateObj = new Date(d);
    return {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
    };
  };

  // Create grid cells array
  const gridCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    gridCells.push({ isPadding: true, key: `pad-start-${i}` });
  }

  for (let d = 1; d <= totalDaysInMonth; d++) {
    const monthStr = String(targetMonth).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const dateStr = `${targetYear}-${monthStr}-${dayStr}`;

    gridCells.push({
      isPadding: false,
      dayNumber: d,
      dateStr: dateStr,
      key: `day-${d}`,
    });
  }

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    if (!post.date) return false;
    const parts = getPostDateParts(post.date);
    if (!parts) return false;

    if (parts.year !== targetYear || parts.month !== targetMonth) {
      return false;
    }

    if (platformFilter !== 'All') {
      const p = (post.platform || '').toLowerCase();
      const filter = platformFilter.toLowerCase();
      if (filter === 'x' || filter === 'x/twitter') {
        if (!p.includes('x') && !p.includes('twitter')) return false;
      } else if (!p.includes(filter)) {
        return false;
      }
    }

    if (statusFilter !== 'All' && post.status !== statusFilter) return false;

    return true;
  });

  // Map posts by day number
  const postsByDay = {};
  filteredPosts.forEach((post) => {
    const parts = getPostDateParts(post.date);
    if (parts && parts.day) {
      if (!postsByDay[parts.day]) postsByDay[parts.day] = [];
      postsByDay[parts.day].push(post);
    }
  });

  // Drag & drop reschedule handlers
  const handleDragStart = (e, post) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ postId: post._id, idea: post.idea || post.title }));
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
      today.getMonth() + 1 === targetMonth &&
      today.getFullYear() === targetYear
    );
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Calendar Controls & Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          padding: '0.85rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}>
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
            <option value="X">X (Twitter)</option>
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
          Showing <span style={{ color: '#ec4899', fontWeight: 700 }}>{filteredPosts.length}</span> posts in grid
        </div>
      </div>

      {/* Overflow Scroll Container for Responsive Grid */}
      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <div className="calendar-grid" style={{ minWidth: '750px', marginTop: 0 }}>
          {/* Grid Headers */}
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
                    background: 'rgba(15, 23, 42, 0.25)',
                    borderRadius: '12px',
                    minHeight: '125px',
                    border: '1px solid rgba(255, 255, 255, 0.03)',
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
                    title="Add Post on this date"
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    paddingRight: '0.1rem',
                  }}
                >
                  {dayPosts.map((post) => {
                    const displayPlatform = post.platform || 'Instagram';
                    const cleanPlatformClass = displayPlatform.replace(/[^a-zA-Z]/g, '');

                    return (
                      <div
                        key={post._id}
                        className="post-tile"
                        draggable
                        onDragStart={(e) => handleDragStart(e, post)}
                        onClick={() => onSelectPost(post)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span className={`platform-badge platform-${cleanPlatformClass}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>
                            {displayPlatform}
                          </span>
                          <span className={`status-badge status-${post.status}`} style={{ fontSize: '0.58rem', padding: '0.05rem 0.3rem' }}>
                            {post.status}
                          </span>
                        </div>
                        <div className="post-tile-title">{post.idea || post.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                          <Clock size={10} />
                          <span>{post.timeSlot || '09:00 AM'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
