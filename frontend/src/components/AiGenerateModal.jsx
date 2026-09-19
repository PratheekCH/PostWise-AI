import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { calendarAPI } from '../services/api';
import { X, Sparkles, Loader2, Calendar as CalendarIcon, Target, Layers } from 'lucide-react';

const AiGenerateModal = ({ isOpen, onClose, onGenerated }) => {
  const { brands, activeBrand, showToast } = useAuth();

  const currentDate = new Date();
  const [selectedBrandId, setSelectedBrandId] = useState(activeBrand ? activeBrand._id : (brands[0] ? brands[0]._id : ''));
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [topicNiche, setTopicNiche] = useState('');
  const [goals, setGoals] = useState('Brand growth, engagement & audience building');
  const [postFrequency, setPostFrequency] = useState('daily');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBrandId) {
      showToast('Please select or create a brand profile first', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await calendarAPI.generateCalendar({
        brandId: selectedBrandId,
        month: parseInt(month, 10),
        year: parseInt(year, 10),
        topicNiche: topicNiche.trim(),
        goals: goals.trim(),
        postFrequency,
      });

      showToast(`Successfully generated ${res.data.posts.length} posts calendar!`, 'success');
      if (onGenerated) onGenerated(res.data.calendar, res.data.posts);
      onClose();
    } catch (err) {
      console.error('AI Generation Error:', err);
      showToast(err.response?.data?.message || 'Failed to generate AI calendar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ec4899, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>AI Social Calendar Generator</h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Generate 30 days of platform-tailored social posts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', color: '#94a3b8', padding: '0.3rem', display: 'flex' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Target Brand Profile */}
            <div className="form-group">
              <label className="form-label">Target Brand Profile</label>
              <select
                className="form-select"
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
                required
              >
                <option value="" disabled>-- Select Brand --</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.industry} - {b.tone})
                  </option>
                ))}
              </select>
            </div>

            {/* Month & Year */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Month</label>
                <select
                  className="form-select"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {monthsList.map((m, idx) => (
                    <option key={m} value={idx + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Year</label>
                <select
                  className="form-select"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>
            </div>

            {/* Topic / Niche */}
            <div className="form-group">
              <label className="form-label">Topic / Niche Focus (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AI tools, productivity hacks, product launch"
                value={topicNiche}
                onChange={(e) => setTopicNiche(e.target.value)}
              />
            </div>

            {/* Content Goals */}
            <div className="form-group">
              <label className="form-label">Content Objectives & Goals</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Drive website clicks, build brand awareness, boost engagement"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
            </div>

            {/* Posting Frequency */}
            <div className="form-group">
              <label className="form-label">Posting Frequency</label>
              <select
                className="form-select"
                value={postFrequency}
                onChange={(e) => setPostFrequency(e.target.value)}
              >
                <option value="daily">Daily (30 posts)</option>
                <option value="alternate">Alternate Days (15 posts)</option>
                <option value="weekdays">Weekdays Only (~22 posts)</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gradient" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Generating AI Posts...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Full Calendar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AiGenerateModal;
