import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { brandAPI } from '../services/api';
import { 
  Building2, 
  Save, 
  Trash2, 
  Plus, 
  Sparkles, 
  Check, 
  Globe, 
  Tag, 
  MessageSquare, 
  Target,
  Instagram,
  Linkedin,
  Twitter,
  Wand2
} from 'lucide-react';

const TONE_OPTIONS = [
  'Inspirational',
  'Professional & Authoritative',
  'Playful & Witty',
  'Educational & Analytical',
  'Bold & Direct',
  'Warm & Mindful',
];

const PRESETS = [
  {
    name: 'EcoGlow Wellness',
    niche: 'Sustainable Living & Mindful Yoga',
    targetAudience: 'Health-conscious professionals, eco-minded millennials (ages 24-42)',
    tone: 'Warm & Mindful',
    postingGoals: 'Build high-trust community, share daily wellness habits, promote cork mats',
    handles: { instagram: '@ecoglow.wellness', linkedin: 'EcoGlow Global', twitter: '@EcoGlowLife' },
    color: '#059669',
  },
  {
    name: 'NexusAI Cloud',
    niche: 'Developer Tools & Cloud Infrastructure',
    targetAudience: 'Full-stack engineers, DevOps leads, engineering founders',
    tone: 'Professional & Authoritative',
    postingGoals: 'Showcase low latency benchmarks, build community for v2 launch',
    handles: { instagram: '@nexusai_hq', linkedin: 'NexusAI Systems', twitter: '@nexusai_dev' },
    color: '#4f46e5',
  },
  {
    name: 'Velvet Bean Roasters',
    niche: 'Artisanal Specialty Coffee & Cold Brew',
    targetAudience: 'Specialty coffee lovers, remote creatives, cafe regulars',
    tone: 'Playful & Witty',
    postingGoals: 'Single-origin farmer spotlights, pour-over tips, coffee club subscriptions',
    handles: { instagram: '@velvetbeancoffee', linkedin: 'Velvet Bean Roasters', twitter: '@VelvetBeanCo' },
    color: '#d97706',
  },
];

const BrandProfile = () => {
  const { brands, activeBrand, selectActiveBrand, refreshBrands, showToast } = useAuth();

  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [isEditingNew, setIsEditingNew] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Inspirational');
  const [postingGoals, setPostingGoals] = useState('');
  const [igHandle, setIgHandle] = useState('');
  const [liHandle, setLiHandle] = useState('');
  const [xHandle, setXHandle] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeBrand && !isEditingNew) {
      loadBrandToForm(activeBrand);
    } else if (brands && brands.length > 0 && !isEditingNew) {
      loadBrandToForm(brands[0]);
    }
  }, [activeBrand, brands]);

  const loadBrandToForm = (brand) => {
    setSelectedBrandId(brand._id);
    setIsEditingNew(false);
    setName(brand.name || '');
    setNiche(brand.niche || brand.industry || '');
    setTargetAudience(brand.targetAudience || '');
    setTone(brand.tone || 'Inspirational');
    setPostingGoals(brand.postingGoals || '');
    setIgHandle(brand.handles?.instagram || '');
    setLiHandle(brand.handles?.linkedin || '');
    setXHandle(brand.handles?.twitter || '');
    setColor(brand.color || '#4f46e5');
  };

  const handleCreateNewClick = () => {
    setSelectedBrandId(null);
    setIsEditingNew(true);
    setName('');
    setNiche('');
    setTargetAudience('');
    setTone('Inspirational');
    setPostingGoals('');
    setIgHandle('');
    setLiHandle('');
    setXHandle('');
    setColor('#4f46e5');
  };

  const applyPreset = (preset) => {
    setName(preset.name);
    setNiche(preset.niche);
    setTargetAudience(preset.targetAudience);
    setTone(preset.tone);
    setPostingGoals(preset.postingGoals);
    setIgHandle(preset.handles.instagram);
    setLiHandle(preset.handles.linkedin);
    setXHandle(preset.handles.twitter);
    setColor(preset.color);
    showToast(`Loaded preset template: ${preset.name}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Brand name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        niche: niche.trim(),
        targetAudience: targetAudience.trim(),
        tone,
        postingGoals: postingGoals.trim(),
        color,
        platforms: ['Instagram', 'LinkedIn', 'X/Twitter'],
        handles: {
          instagram: igHandle.trim() || `@${name.toLowerCase().replace(/\s+/g, '')}`,
          linkedin: liHandle.trim() || name,
          twitter: xHandle.trim() || `@${name.toLowerCase().replace(/\s+/g, '')}`,
        },
      };

      if (selectedBrandId && !isEditingNew) {
        await brandAPI.updateBrand(selectedBrandId, payload);
        showToast('Brand profile updated!', 'success');
      } else {
        const created = await brandAPI.createBrand(payload);
        setSelectedBrandId(created._id);
        setIsEditingNew(false);
        showToast('New brand profile created!', 'success');
      }

      await refreshBrands();
    } catch (err) {
      showToast('Failed to save brand profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBrandId) return;
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await brandAPI.deleteBrand(selectedBrandId);
      showToast('Brand deleted', 'info');
      await refreshBrands();
      handleCreateNewClick();
    } catch (err) {
      showToast('Failed to delete brand', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Brand Profile & Persona
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your brand voice, audience niche, and social handles for AI calendar generation
          </p>
        </div>

        {/* 1-Click Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 hidden md:inline">Quick Presets:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50 text-[11px] font-bold text-slate-700 hover:text-indigo-600 transition-all cursor-pointer"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Brand List (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Brand Profiles ({brands ? brands.length : 0})
              </span>
              <button
                type="button"
                onClick={handleCreateNewClick}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {brands && brands.map((b) => {
                const isSelected = selectedBrandId === b._id && !isEditingNew;
                const isActiveWorkspace = activeBrand && activeBrand._id === b._id;

                return (
                  <div
                    key={b._id}
                    onClick={() => {
                      loadBrandToForm(b);
                      selectActiveBrand(b);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
                        style={{ backgroundColor: b.color || '#4f46e5' }}
                      >
                        {b.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{b.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{b.niche || b.industry}</p>
                      </div>
                    </div>

                    {isActiveWorkspace && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Click any profile to load its identity for AI calendar generation.
          </div>
        </div>

        {/* Right: Brand Profile Form (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isEditingNew ? 'Create New Brand Identity' : `Editing: ${name || 'Brand Profile'}`}
              </h3>
              {selectedBrandId && !isEditingNew && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Profile
                </button>
              )}
            </div>

            {/* Brand Name & Color */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. EcoGlow Wellness"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brand Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                  />
                  <span className="text-xs font-bold text-slate-700">{color}</span>
                </div>
              </div>
            </div>

            {/* Niche / Industry */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Niche & Industry
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. Sustainable Yoga, Organic Living & Mindfulness"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Audience Persona
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Health-conscious millennials, yoga practitioners, busy remote professionals (24-40)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs"
              />
            </div>

            {/* Tone of Voice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Brand Tone of Voice
              </label>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      tone === t
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Posting Goals */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Posting Goals & Strategic Outcomes
              </label>
              <textarea
                rows={3}
                value={postingGoals}
                onChange={(e) => setPostingGoals(e.target.value)}
                placeholder="e.g. 3 posts per week on product launches, behind-the-scenes, and mindful habit tips to build high trust"
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs resize-none"
              />
            </div>

            {/* Social Media Handles */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Platform Social Handles
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                  <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                  <input
                    type="text"
                    value={igHandle}
                    onChange={(e) => setIgHandle(e.target.value)}
                    placeholder="@handle"
                    className="w-full bg-transparent text-xs text-slate-800 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                  <Linkedin className="w-4 h-4 text-[#0A66C2] shrink-0" />
                  <input
                    type="text"
                    value={liHandle}
                    onChange={(e) => setLiHandle(e.target.value)}
                    placeholder="Page Name"
                    className="w-full bg-transparent text-xs text-slate-800 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50">
                  <Twitter className="w-4 h-4 text-slate-900 shrink-0" />
                  <input
                    type="text"
                    value={xHandle}
                    onChange={(e) => setXHandle(e.target.value)}
                    placeholder="@handle"
                    className="w-full bg-transparent text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Brand Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;
