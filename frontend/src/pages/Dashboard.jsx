import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calendarAPI } from '../services/api';
import { Calendar, Sparkles, Building2, CheckCircle2, Clock, Trash2, ArrowUpRight, BarChart3, Layers, Plus } from 'lucide-react';

const Dashboard = ({ onNavigate, onOpenAiGenerator, onSelectCalendar }) => {
  const { user, activeBrand, brands, showToast } = useAuth();
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCalendars = async () => {
    try {
      setLoading(true);
      const res = await calendarAPI.getCalendars();
      setCalendars(res.data.calendars || []);
    } catch (err) {
      console.error('Error fetching calendars:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  const handleDeleteCalendar = async (id) => {
    if (!window.confirm('Delete this calendar and all its posts?')) return;
    try {
      await calendarAPI.deleteCalendar(id);
      showToast('Calendar deleted', 'info');
      fetchCalendars();
    } catch (err) {
      showToast('Failed to delete calendar', 'error');
    }
  };

  // Stats calculation
  const totalCalendars = calendars.length;
  const totalPostsCount = calendars.reduce((acc, c) => acc + (c.postsCount || 0), 0);
  const activePlatforms = activeBrand?.platforms?.length || 3;

  return (
    <div className="page-wrapper">
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.15))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            AI Content Command Center
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.3rem 0 0.4rem' }}>
            Welcome back, {user?.name || 'Creator'}! 👋
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '600px' }}>
            Active Brand: <strong style={{ color: '#f8fafc' }}>{activeBrand ? activeBrand.name : 'No brand selected'}</strong>. Generate automated 30-day multi-platform social media content calendars in seconds.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onNavigate('brands')} className="btn btn-secondary">
            <Building2 size={18} />
            <span>Manage Brand</span>
          </button>
          <button onClick={onOpenAiGenerator} className="btn btn-gradient">
            <Sparkles size={18} />
            <span>Generate AI Calendar</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#6366f1', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>Total AI Calendars</span>
            <Calendar size={22} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>{totalCalendars}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>Across all brand profiles</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ec4899', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>Generated Social Posts</span>
            <Sparkles size={22} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>{totalPostsCount}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>Ready for scheduling & publication</div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#14b8a6', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>Active Platforms</span>
            <Layers size={22} />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }}>{activePlatforms}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
            {activeBrand ? activeBrand.platforms.join(', ') : 'Instagram, LinkedIn, X'}
          </div>
        </div>
      </div>

      {/* Main Grid: Calendars List & Quick Brand Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Calendars Section */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recent AI Calendars</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Click any calendar to inspect and edit posts in calendar grid</p>
            </div>
            <button onClick={onOpenAiGenerator} className="btn btn-primary btn-sm">
              <Plus size={16} /> + New Calendar
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading calendars...</div>
          ) : calendars.length === 0 ? (
            <div
              style={{
                padding: '3rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                borderRadius: '12px',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
              }}
            >
              <Calendar size={40} color="#6366f1" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>No AI Calendars Yet</h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.2rem' }}>
                Set up your brand profile and generate your first automated social media calendar.
              </p>
              <button onClick={onOpenAiGenerator} className="btn btn-gradient btn-sm">
                <Sparkles size={16} /> Generate AI Calendar
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {calendars.map((cal) => (
                <div
                  key={cal._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
                >
                  <div style={{ cursor: 'pointer' }} onClick={() => onSelectCalendar(cal)}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{cal.title}</div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      <span>Topic: {cal.topicNiche || 'General'}</span>
                      <span>•</span>
                      <span style={{ color: '#ec4899', fontWeight: 600 }}>{cal.postsCount} Posts</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => onSelectCalendar(cal)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '0.3rem' }}
                    >
                      <span>View Calendar</span>
                      <ArrowUpRight size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCalendar(cal._id)}
                      className="btn btn-danger btn-sm"
                      title="Delete Calendar"
                      style={{ padding: '0.4rem 0.6rem' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brand Summary Sidebar Widget */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Active Brand Tone & Strategy</h3>
          {activeBrand ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Brand Name</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1' }}>{activeBrand.name}</div>
              </div>

              <div>
                <label className="form-label">Tone of Voice</label>
                <span className="status-badge status-scheduled" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                  🎭 {activeBrand.tone}
                </span>
              </div>

              <div>
                <label className="form-label">Target Audience</label>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>{activeBrand.targetAudience}</div>
              </div>

              <div>
                <label className="form-label">Target Platforms</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                  {(activeBrand.platforms || []).map((p) => (
                    <span key={p} className={`platform-badge platform-${p.replace(/[^a-zA-Z]/g, '')}`}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Core Keywords</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(activeBrand.keywords || []).map((k) => (
                    <span
                      key={k}
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.5rem',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '6px',
                        color: '#94a3b8',
                      }}
                    >
                      #{k}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onNavigate('brands')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                Edit Brand Configuration
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8' }}>
              <p style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>No active brand configured.</p>
              <button onClick={() => onNavigate('brands')} className="btn btn-primary btn-sm">
                + Create Brand Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
