import React, { useState, useEffect } from 'react';
import { postAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, Sparkles, Calendar, Clock, RefreshCw, Save, Trash2, CheckCircle, Image, MessageSquare, Lightbulb, Hash } from 'lucide-react';

const PostEditorModal = ({ post, isOpen, onClose, onPostUpdated, onPostDeleted }) => {
  const { showToast } = useAuth();

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [status, setStatus] = useState('draft');
  const [postType, setPostType] = useState('Single Image');
  const [dateStr, setDateStr] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [imagePrompt, setImagePrompt] = useState('');
  const [engagementTip, setEngagementTip] = useState('');

  const [customInstruction, setCustomInstruction] = useState('');
  const [regenerating, setRegenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setCaption(post.caption || '');
      setHashtagsStr(Array.isArray(post.hashtags) ? post.hashtags.join(' ') : '');
      setPlatform(post.platform || 'Instagram');
      setStatus(post.status || 'draft');
      setPostType(post.postType || 'Single Image');
      setTimeSlot(post.timeSlot || '09:00 AM');
      setImagePrompt(post.imagePrompt || '');
      setEngagementTip(post.engagementTip || '');

      if (post.date) {
        const d = new Date(post.date);
        const iso = d.toISOString().split('T')[0];
        setDateStr(iso);
      }
    }
  }, [post]);

  if (!isOpen || !post) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formattedHashtags = hashtagsStr
        .split(/[\s,]+/)
        .map((h) => (h.startsWith('#') ? h : `#${h}`))
        .filter((h) => h.length > 1);

      const res = await postAPI.updatePost(post._id, {
        title,
        caption,
        hashtags: formattedHashtags,
        platform,
        status,
        postType,
        date: dateStr,
        timeSlot,
        imagePrompt,
        engagementTip,
      });

      showToast('Post updated successfully!', 'success');
      if (onPostUpdated) onPostUpdated(res.data.post);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update post', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await postAPI.regeneratePost(post._id, customInstruction);
      setTitle(res.data.post.title);
      setCaption(res.data.post.caption);
      setHashtagsStr(Array.isArray(res.data.post.hashtags) ? res.data.post.hashtags.join(' ') : '');
      setImagePrompt(res.data.post.imagePrompt || '');
      setEngagementTip(res.data.post.engagementTip || '');
      showToast('Post regenerated with AI!', 'success');
      if (onPostUpdated) onPostUpdated(res.data.post);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to regenerate post', 'error');
    } finally {
      setRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await postAPI.deletePost(post._id);
      showToast('Post deleted', 'info');
      if (onPostDeleted) onPostDeleted(post._id);
      onClose();
    } catch (err) {
      showToast('Failed to delete post', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`platform-badge platform-${platform.replace(/[^a-zA-Z]/g, '')}`}>
              {platform}
            </span>
            <span className={`status-badge status-${status}`}>{status}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: '#94a3b8', padding: '0.3rem', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Title & Platform Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Post Headline / Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Platform</label>
                <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X/Twitter">X/Twitter</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Facebook">Facebook</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Date, Time & Format Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Scheduled Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Time Slot</label>
                <select className="form-select" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                  <option value="08:30 AM">08:30 AM</option>
                  <option value="10:15 AM">10:15 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="04:45 PM">04:45 PM</option>
                  <option value="07:30 PM">07:30 PM</option>
                  <option value="09:00 PM">09:00 PM</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Content Format</label>
                <select className="form-select" value={postType} onChange={(e) => setPostType(e.target.value)}>
                  <option value="Single Image">Single Image</option>
                  <option value="Carousel">Carousel</option>
                  <option value="Reel / Short Video">Reel / Video</option>
                  <option value="Text Article">Text Article</option>
                  <option value="Poll / Question">Poll / Q&A</option>
                </select>
              </div>
            </div>

            {/* Caption Textarea */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Caption Body</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{caption.length} chars</span>
              </label>
              <textarea
                className="form-textarea"
                rows={5}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              />
            </div>

            {/* Hashtags */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Hashtags</label>
              <input
                type="text"
                className="form-input"
                placeholder="#Brand #Niche #Strategy"
                value={hashtagsStr}
                onChange={(e) => setHashtagsStr(e.target.value)}
              />
            </div>

            {/* AI Image Prompt & Engagement Tip */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#ec4899', marginBottom: '0.4rem' }}>
                  <Image size={15} /> AI Visual / Image Suggestion
                </div>
                <textarea
                  className="form-textarea"
                  rows={2}
                  style={{ fontSize: '0.82rem' }}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                />
              </div>

              <div
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#14b8a6', marginBottom: '0.4rem' }}>
                  <Lightbulb size={15} /> Engagement Tip
                </div>
                <textarea
                  className="form-textarea"
                  rows={2}
                  style={{ fontSize: '0.82rem' }}
                  value={engagementTip}
                  onChange={(e) => setEngagementTip(e.target.value)}
                />
              </div>
            </div>

            {/* AI Single-Post Regeneration Box */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.08))',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem' }}>
                  <Sparkles size={16} color="#ec4899" />
                  <span>Regenerate Post Content with AI</span>
                </div>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="btn btn-secondary btn-sm"
                  disabled={regenerating}
                  style={{ gap: '0.4rem' }}
                >
                  <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
                  <span>{regenerating ? 'Rewriting...' : 'Regenerate Now'}</span>
                </button>
              </div>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.83rem', background: 'rgba(15, 23, 42, 0.6)' }}
                placeholder="Optional AI prompt tweak (e.g. Make it shorter, add a punchy question, emphasize special discount)"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
              <Trash2 size={16} />
              <span>Delete Post</span>
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostEditorModal;
