import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  RotateCw, 
  Save, 
  Trash2, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  ThumbsUp, 
  Repeat2, 
  Send, 
  MoreHorizontal,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';

const PostEditorModal = () => {
  const { selectedPost, isEditorOpen, closePostEditor, updatePost, deletePost, regeneratePost } = useCalendar();
  const { activeBrand } = useAuth();

  const [previewPlatform, setPreviewPlatform] = useState('Instagram');
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
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title || '');
      setCaption(selectedPost.caption || '');
      setHashtagsStr(
        Array.isArray(selectedPost.hashtags)
          ? selectedPost.hashtags.join(' ')
          : selectedPost.hashtags || ''
      );
      setPlatform(selectedPost.platform || 'Instagram');
      setPreviewPlatform(selectedPost.platform || 'Instagram');
      setStatus(selectedPost.status || 'draft');
      setPostType(selectedPost.postType || 'Single Image');
      setTimeSlot(selectedPost.timeSlot || '09:00 AM');
      setImagePrompt(selectedPost.imagePrompt || '');
      setEngagementTip(selectedPost.engagementTip || '');

      if (selectedPost.date) {
        const cleanDate = selectedPost.date.split('T')[0];
        setDateStr(cleanDate);
      }
    }
  }, [selectedPost]);

  if (!isEditorOpen || !selectedPost) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formattedHashtags = hashtagsStr
        .split(/[\s,]+/)
        .map((h) => (h.startsWith('#') ? h : `#${h}`))
        .filter((h) => h.length > 1);

      await updatePost(selectedPost._id, {
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
      closePostEditor();
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const updated = await regeneratePost(selectedPost._id, customInstruction);
      if (updated) {
        setTitle(updated.title);
        setCaption(updated.caption);
        setHashtagsStr(
          Array.isArray(updated.hashtags) ? updated.hashtags.join(' ') : updated.hashtags || ''
        );
        setImagePrompt(updated.imagePrompt || '');
        setEngagementTip(updated.engagementTip || '');
      }
      setCustomInstruction('');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this scheduled post?')) {
      await deletePost(selectedPost._id);
    }
  };

  const characterCount = caption.length;
  const wordCount = caption.trim() ? caption.trim().split(/\s+/).length : 0;
  const isOverTwitterLimit = previewPlatform === 'X/Twitter' && characterCount > 280;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl w-full h-full overflow-hidden flex flex-col transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Post Details & Editor</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailor captions, preview across platforms, or regenerate with AI
              </p>
            </div>
          </div>

          <button
            onClick={closePostEditor}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Fields (7 cols) */}
          <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Post Title / Hook
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-xs"
                placeholder="e.g. 5-Minute Morning Reset Habit"
                required
              />
            </div>

            {/* Platform & Post Type Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Primary Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => {
                    setPlatform(e.target.value);
                    setPreviewPlatform(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="X/Twitter">X / Twitter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Format Type
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Single Image">Single Image</option>
                  <option value="Carousel">Carousel</option>
                  <option value="Reel / Short Video">Reel / Short Video</option>
                  <option value="Text Article">Text Article</option>
                  <option value="Poll / Question">Poll / Question</option>
                </select>
              </div>
            </div>

            {/* Date, Time & Status */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Time Slot
                </label>
                <input
                  type="text"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="09:00 AM"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Caption */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Post Caption & Content
                </label>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span className={isOverTwitterLimit ? 'text-rose-600 font-bold' : ''}>
                    {characterCount} chars {previewPlatform === 'X/Twitter' && '/ 280'}
                  </span>
                </div>
              </div>
              <textarea
                rows={6}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-normal text-slate-800 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-xs"
                placeholder="Write or edit post copy..."
                required
              />
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Hashtags (separated by space or comma)
              </label>
              <input
                type="text"
                value={hashtagsStr}
                onChange={(e) => setHashtagsStr(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-xs"
                placeholder="#Wellness #MindfulLiving #Growth"
              />
            </div>

            {/* AI Image / Visual Prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                AI Visual Prompt / Unsplash Keyword Idea
              </label>
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Describe suggested graphic, image, or video style..."
              />
            </div>

            {/* Single Post AI Regeneration Box */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex flex-col gap-2.5 mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Regenerate Post with Custom AI Direction
                </div>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  {isRegenerating ? 'Crafting idea...' : 'Regenerate'}
                </button>
              </div>

              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="e.g. 'Make it more casual with a stronger question at the end'..."
                className="w-full px-3 py-1.5 rounded-xl border border-indigo-200/80 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </form>

          {/* Right Column: Live Platform Preview Simulation (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Live Feed Preview
              </span>

              {/* Platform Preview Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('Instagram')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewPlatform === 'Instagram'
                      ? 'bg-white dark:bg-slate-900 text-pink-600 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  IG
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('LinkedIn')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewPlatform === 'LinkedIn'
                      ? 'bg-white dark:bg-slate-900 text-[#0A66C2] shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewPlatform('X/Twitter')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewPlatform === 'X/Twitter'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  X
                </button>
              </div>
            </div>

            {/* INSTAGRAM SIMULATION */}
            {previewPlatform === 'Instagram' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden text-xs transition-colors">
                {/* IG Top bar */}
                <div className="p-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600">
                      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full p-[1px]">
                        <img
                          src={
                            activeBrand?.color
                              ? `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&auto=format&fit=crop&q=80`
                              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
                          }
                          alt="brand"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {activeBrand?.handles?.instagram || 'brand.handle'}
                      </p>
                      <p className="text-[10px] text-slate-400">Sponsored • Audio: Original</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </div>

                {/* Simulated Image Media Box */}
                <div className="relative aspect-square bg-slate-900 flex flex-col justify-end p-4 text-white overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80"
                    alt="post visual"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="relative z-10">
                    <span className="inline-block px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-[10px] font-semibold mb-1">
                      {postType}
                    </span>
                    <p className="font-bold text-sm text-white drop-shadow leading-snug">
                      {title}
                    </p>
                  </div>
                </div>

                {/* IG Action Buttons */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-rose-500 fill-rose-500 cursor-pointer" />
                      <MessageCircle className="w-5 h-5 text-slate-700 dark:text-slate-300 cursor-pointer" />
                      <Send className="w-5 h-5 text-slate-700 dark:text-slate-300 cursor-pointer" />
                    </div>
                    <Bookmark className="w-5 h-5 text-slate-700 dark:text-slate-300 cursor-pointer" />
                  </div>

                  <p className="font-bold text-[11px] text-slate-900 dark:text-slate-100 mb-1">324 likes</p>

                  <div className="text-slate-800 dark:text-slate-200 leading-relaxed max-h-36 overflow-y-auto pr-1">
                    <span className="font-bold mr-1.5 text-slate-900 dark:text-slate-100">
                      {activeBrand?.handles?.instagram || 'brand.handle'}
                    </span>
                    <span className="whitespace-pre-line">{caption}</span>
                  </div>

                  {hashtagsStr && (
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium text-[11px] mt-2">
                      {hashtagsStr}
                    </p>
                  )}

                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-2">
                    Scheduled for {dateStr} at {timeSlot}
                  </p>
                </div>
              </div>
            )}

            {/* LINKEDIN SIMULATION */}
            {previewPlatform === 'LinkedIn' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card p-4 text-xs transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                      {activeBrand?.name ? activeBrand.name.charAt(0) : 'E'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {activeBrand?.handles?.linkedin || activeBrand?.name || 'Company Name'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">12,450 followers • 2h • 🌐</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2">{title}</h4>

                <div className="text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto pr-1">
                  {caption}
                </div>

                {hashtagsStr && (
                  <p className="text-[#0A66C2] dark:text-blue-400 font-semibold text-xs mt-2">{hashtagsStr}</p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-medium">
                    👍 💡 184 reactions
                  </span>
                  <span>26 comments • 8 reposts</span>
                </div>

                <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center font-bold text-slate-600 dark:text-slate-400 text-[11px]">
                  <div className="flex items-center justify-center gap-1 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" /> Like
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" /> Comment
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <Repeat2 className="w-3.5 h-3.5" /> Repost
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <Send className="w-3.5 h-3.5" /> Send
                  </div>
                </div>
              </div>
            )}

            {/* X / TWITTER SIMULATION */}
            {previewPlatform === 'X/Twitter' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-card p-4 text-xs transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    𝕏
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {activeBrand?.name || 'Brand Name'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {activeBrand?.handles?.twitter || '@brand'}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">now</span>
                    </div>

                    <div className="mt-2 text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed text-sm">
                      {caption}
                    </div>

                    {hashtagsStr && (
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium text-xs mt-2">{hashtagsStr}</p>
                    )}

                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 max-w-sm">
                      <span className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
                        <MessageCircle className="w-4 h-4" /> 18
                      </span>
                      <span className="flex items-center gap-1 cursor-pointer hover:text-emerald-600">
                        <Repeat2 className="w-4 h-4" /> 42
                      </span>
                      <span className="flex items-center gap-1 cursor-pointer hover:text-rose-600">
                        <Heart className="w-4 h-4" /> 156
                      </span>
                      <span className="flex items-center gap-1 cursor-pointer hover:text-indigo-600">
                        <Bookmark className="w-4 h-4" /> 23
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tactical AI Tip Box */}
            {engagementTip && (
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-bold flex items-center gap-1.5 text-amber-950 dark:text-amber-100 mb-0.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Strategy Tip:
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{engagementTip}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete Post
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={closePostEditor}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditorModal;
