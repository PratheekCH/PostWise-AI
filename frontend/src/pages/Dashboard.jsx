import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCalendar } from '../context/CalendarContext';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  Building2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Trash2, 
  Plus, 
  Instagram, 
  Linkedin, 
  Twitter,
  CheckCircle2
} from 'lucide-react';
import AiGenerateModal from '../components/AiGenerateModal';

const Dashboard = () => {
  const { user, activeBrand, brands } = useAuth();
  const { calendars, posts, selectCalendar, deleteCalendar } = useCalendar();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const navigate = useNavigate();

  // Metric stats
  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  // Next 4 scheduled posts
  const upcomingPosts = [...posts]
    .filter((p) => p.status === 'scheduled')
    .slice(0, 4);

  const getPlatformIcon = (p) => {
    if (p === 'Instagram') return <Instagram className="w-3 h-3 text-pink-500" />;
    if (p === 'LinkedIn') return <Linkedin className="w-3 h-3 text-[#0A66C2]" />;
    return <Twitter className="w-3 h-3 text-slate-800" />;
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-7 md:p-9 rounded-3xl shadow-md relative overflow-hidden">
        {/* Background decorative accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Social Media Command Center
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Alex'}! 👋
            </h1>
            <p className="text-indigo-100/80 text-sm md:text-base mt-2 leading-relaxed">
              Managing <strong className="text-white">{activeBrand?.name || 'EcoGlow Wellness'}</strong>. Generate 30 days of platform-tailored social media posts, reschedule via drag-and-drop, and export roadmaps in seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-900 font-bold text-sm hover:bg-slate-100 shadow-lg shadow-black/10 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Generate 30-Day Plan</span>
            </button>
            <button
              onClick={() => navigate('/calendar')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Open Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Posts Generated</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{posts.length}</div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">100% complete</span> 30-day roadmap
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Scheduled Posts</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">{scheduledCount}</div>
          <p className="text-xs text-slate-500 mt-2">
            Ready for auto-publish across platforms
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Platforms</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">3</div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 font-bold">Instagram</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">LinkedIn</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">X</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estimated Engagement</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">5.8%</div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">+1.4%</span> above industry average
          </p>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Posts & Brand Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Posts Queue (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upcoming Posts Queue</h3>
                <p className="text-xs text-slate-500">Next scheduled posts ready for distribution</p>
              </div>
              <button
                onClick={() => navigate('/calendar')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All In Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {upcomingPosts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => navigate('/calendar')}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {post.caption}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-slate-800 block">
                      {post.date}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-medium">
                      {post.timeSlot}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tip: Drag posts directly between days on the Calendar grid to reschedule!</span>
          </div>
        </div>

        {/* Right: Active Brand & Recent Calendars (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Brand Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Brand Profile
              </span>
              <button
                onClick={() => navigate('/brand')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Edit Brand
              </button>
            </div>

            {activeBrand ? (
              <div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-xs"
                    style={{ backgroundColor: activeBrand.color || '#059669' }}
                  >
                    {activeBrand.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{activeBrand.name}</h4>
                    <p className="text-xs text-slate-500">{activeBrand.niche}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p>
                    <strong className="text-slate-800">Voice Tone:</strong> {activeBrand.tone}
                  </p>
                  <p>
                    <strong className="text-slate-800">Posting Goal:</strong> {activeBrand.postingGoals}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">No brand configured yet.</div>
            )}
          </div>

          {/* Recent Calendars List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Saved Calendars ({calendars.length})
              </span>
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                New
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {calendars.map((cal) => (
                <div
                  key={cal._id}
                  onClick={() => {
                    selectCalendar(cal);
                    navigate('/calendar');
                  }}
                  className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                      {cal.topic || cal.month}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {cal.month} • 30 Posts
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Generator Modal */}
      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onGenerated={() => navigate('/calendar')}
      />
    </div>
  );
};

export default Dashboard;
