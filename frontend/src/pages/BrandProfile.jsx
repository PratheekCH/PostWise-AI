import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { brandAPI } from '../services/api';
import { Building2, Save, Trash2, Plus, Sparkles, Check, Globe, Tag, MessageSquare, Target } from 'lucide-react';

const TONE_OPTIONS = ['Professional', 'Witty & Fun', 'Inspirational', 'Educational', 'Bold & Direct', 'Casual'];
const PLATFORM_OPTIONS = ['Instagram', 'LinkedIn', 'X/Twitter', 'TikTok', 'Facebook', 'YouTube'];

const BrandProfile = () => {
  const { brands, activeBrand, selectActiveBrand, refreshBrands, showToast } = useAuth();

  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [isEditingNew, setIsEditingNew] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [platforms, setPlatforms] = useState(['Instagram', 'LinkedIn', 'X/Twitter']);
  const [keywordsStr, setKeywordsStr] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeBrand && !isEditingNew) {
      loadBrandToForm(activeBrand);
    } else if (brands.length > 0 && !isEditingNew) {
      loadBrandToForm(brands[0]);
    }
  }, [activeBrand, brands]);

  const loadBrandToForm = (brand) => {
    setSelectedBrandId(brand._id);
    setIsEditingNew(false);
    setName(brand.name || '');
    setIndustry(brand.industry || '');
    setTargetAudience(brand.targetAudience || '');
    setTone(brand.tone || 'Professional');
    setPlatforms(brand.platforms || ['Instagram', 'LinkedIn', 'X/Twitter']);
    setKeywordsStr(Array.isArray(brand.keywords) ? brand.keywords.join(', ') : '');
    setDescription(brand.description || '');
    setWebsite(brand.website || '');
  };

  const handleCreateNewClick = () => {
    setSelectedBrandId(null);
    setIsEditingNew(true);
    setName('');
    setIndustry('');
    setTargetAudience('');
    setTone('Professional');
    setPlatforms(['Instagram', 'LinkedIn', 'X/Twitter']);
    setKeywordsStr('');
    setDescription('');
    setWebsite('');
  };

  const togglePlatform = (plat) => {
    if (platforms.includes(plat)) {
      if (platforms.length === 1) {
        showToast('At least one platform must be selected', 'info');
        return;
      }
      setPlatforms(platforms.filter((p) => p !== plat));
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Brand name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const keywords = keywordsStr.split(',').map((k) => k.trim()).filter(Boolean);
      const payload = {
        name: name.trim(),
        industry: industry.trim(),
        targetAudience: targetAudience.trim(),
        tone,
        platforms,
        keywords,
        description: description.trim(),
        website: website.trim(),
      };

      if (selectedBrandId && !isEditingNew) {
        const res = await brandAPI.updateBrand(selectedBrandId, payload);
        showToast('Brand profile updated!', 'success');
        await refreshBrands();
      } else {
        const res = await brandAPI.createBrand(payload);
        showToast('New Brand profile created!', 'success');
        await refreshBrands();
        selectActiveBrand(res.data.brand);
        setIsEditingNew(false);
        setSelectedBrandId(res.data.brand._id);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save brand profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrandId) return;
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await brandAPI.deleteBrand(selectedBrandId);
      showToast('Brand deleted', 'info');
      await refreshBrands();
      setIsEditingNew(true);
      setName('');
    } catch (err) {
      showToast('Failed to delete brand', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Brand Profile Management</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
            Configure your brand identity, tone of voice, audience, and target platforms for AI post generation
          </p>
        </div>
        <button onClick={handleCreateNewClick} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Brand Profile</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.8fr', gap: '1.5rem' }}>
        {/* Left: Brands List */}
        <div className="glass-card">
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Your Brand Profiles ({brands.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {brands.map((b) => {
              const isSelected = selectedBrandId === b._id && !isEditingNew;
              const isActiveContext = activeBrand && activeBrand._id === b._id;

              return (
                <div
                  key={b._id}
                  onClick={() => {
                    loadBrandToForm(b);
                    selectActiveBrand(b);
                  }}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? '#6366f1' : '#f8fafc' }}>
                      {b.name}
                    </span>
                    {isActiveContext && (
                      <span className="status-badge status-scheduled" style={{ fontSize: '0.62rem' }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {b.industry} • {b.tone}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Brand Form */}
        <div className="glass-card">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {isEditingNew ? 'Create Brand Profile' : `Edit Profile: ${name}`}
              </h3>
              {selectedBrandId && !isEditingNew && (
                <button type="button" onClick={handleDeleteBrand} className="btn btn-danger btn-sm">
                  <Trash2 size={16} /> Delete Brand
                </button>
              )}
            </div>

            {/* Brand Name & Industry */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Brand / Company Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. TechPulse AI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Industry / Niche</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Artificial Intelligence, SaaS, E-Commerce"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>

            {/* Target Audience & Website */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Audience Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Startup founders, developers, product managers"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://yourbrand.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </div>

            {/* Tone of Voice Selector */}
            <div className="form-group">
              <label className="form-label">Tone of Voice (AI Content Style)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem', marginTop: '0.3rem' }}>
                {TONE_OPTIONS.map((t) => {
                  const isSelected = tone === t;
                  return (
                    <div
                      key={t}
                      onClick={() => setTone(t)}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)',
                        background: isSelected ? 'rgba(236, 72, 153, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                        color: isSelected ? '#fff' : '#94a3b8',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {t}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Platforms */}
            <div className="form-group">
              <label className="form-label">Target Social Platforms</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.3rem' }}>
                {PLATFORM_OPTIONS.map((plat) => {
                  const isChecked = platforms.includes(plat);
                  return (
                    <button
                      type="button"
                      key={plat}
                      onClick={() => togglePlatform(plat)}
                      className={`platform-badge platform-${plat.replace(/[^a-zA-Z]/g, '')}`}
                      style={{
                        opacity: isChecked ? 1 : 0.4,
                        transform: isChecked ? 'scale(1.02)' : 'scale(0.98)',
                        cursor: 'pointer',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.82rem',
                      }}
                    >
                      {isChecked && <Check size={14} />} {plat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Keywords */}
            <div className="form-group">
              <label className="form-label">Core Keywords / Hashtag Topics (Comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AI, automation, productivity, tech, innovation"
                value={keywordsStr}
                onChange={(e) => setKeywordsStr(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Brand Overview & Mission Statement</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Briefly describe what your brand does and its value proposition..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={18} />
                <span>{loading ? 'Saving Profile...' : isEditingNew ? 'Create Brand Profile' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;
