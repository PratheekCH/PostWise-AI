import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { calendarAPI } from '../services/api';
import { X, Sparkles, Loader2, Calendar as CalendarIcon } from 'lucide-react';

const AiGenerateModal = ({ isOpen, onClose, onGenerated }) => {
  const { brands, activeBrand, showToast } = useAuth();

  const todayIso = new Date().toISOString().split('T')[0];

  const [selectedBrandId, setSelectedBrandId] = useState(activeBrand ? activeBrand._id : (brands[0] ? brands[0]._id : ''));
  const [startDate, setStartDate] = useState(todayIso);
  const [topicNiche, setTopicNiche] = useState('');
  const [goals, setGoals] = useState('Brand growth, engagement & lead generation');
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
      const selectedDate = new Date(startDate);
      const res = await calendarAPI.generateCalendar({
        brandId: selectedBrandId,
        startDate: startDate,
        month: selectedDate.getMonth() + 1,
        year: selectedDate.getFullYear(),
        topicNiche: topicNiche.trim(),
        goals: goals.trim(),
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
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
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Generate 30 platform-tailored social posts with OpenAI</p>
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
                    {b.brandName || b.name} ({b.industry} - {b.tone})
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label className="form-label">Calendar Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Generates ~30 daily posts starting from this date</span>
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
              <label className="form-label">Posting Goals</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Drive website clicks, build brand awareness, boost engagement"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
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
                  <span>Generating 30 Posts...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate 30-Day Calendar</span>
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
