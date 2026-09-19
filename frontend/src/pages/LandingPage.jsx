import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  ArrowRight, 
  CheckCircle2, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Download, 
  RotateCw, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  Layers,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [activePlatformTab, setActivePlatformTab] = useState('Instagram');

  const previews = {
    Instagram: {
      tag: 'Instagram Feed Post • Carousel',
      title: '5-Minute Morning Reset Habit',
      content: `Stop checking your emails before your feet touch the floor. 🧘‍♀️✨\n\nHere's a 3-step morning ritual that will transform your focus today:\n1. 60 seconds of box breathing (in 4, hold 4, out 4)\n2. A glass of lukewarm water with lemon\n3. 3 quick gratitude bullets written on paper\n\nSmall mindful pauses compound into massive peace of mind. Have you taken your first deep breath today? 🌿`,
      hashtags: '#MorningRoutine #MindfulLiving #WellnessJourney',
      metric: '8.4% predicted engagement rate',
    },
    LinkedIn: {
      tag: 'LinkedIn Thought Leadership • Article',
      title: 'The Hidden ROI of Corporate Wellness Programs',
      content: `Burnout isn't a badge of honor. It's an executive balance sheet leak.\n\nOver the past 6 months, our team tracked 14 tech firms before and after introducing 15-minute guided mindfulness breaks:\n\n• 28% drop in reported afternoon fatigue\n• 19% reduction in unplanned sick leaves\n• 4.2x higher peer-to-peer appreciation notes\n\nSustainable performance is an energy management problem, not a time problem.`,
      hashtags: '#Leadership #WorkplaceWellness #CompanyCulture',
      metric: '7.1% predicted engagement rate',
    },
    'X/Twitter': {
      tag: 'X (Twitter) • Snappy Hook',
      title: 'Hot Take on Hustle Culture',
      content: `Unpopular opinion: If your business model requires you to work 16 hours a day for 5 years straight, you didn't build an asset.\n\nYou built a grueling job where the boss never lets you sleep.\n\nOptimize for leverage, clarity, and rest. 🧘‍♂️⚡`,
      hashtags: '#Founders #BuildInPublic #Productivity',
      metric: '6.2% predicted engagement rate (182 / 280 chars)',
    },
  };

  const currentPreview = previews[activePlatformTab];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold text-lg">
              P
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              PostWise<span className="text-indigo-600">.ai</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#demo" className="hover:text-indigo-600 transition-colors">Cross-Platform Voice</a>
            <a href="#workflow" className="hover:text-indigo-600 transition-colors">How It Works</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Launch App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Background glow dots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Hackathon Showcase • AI Social Media Content Calendar Generator
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Generate 30 Days of Tailored Social Posts in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">One Click.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate creative block forever. Input your brand persona once, and PostWise-AI automatically adapts your core message for Instagram, LinkedIn, and X. Reschedule via drag-and-drop and export ready-to-share roadmaps.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Open 30-Day Content Calendar</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-xs transition-colors cursor-pointer"
            >
              <span>1-Click Demo Login</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Drag-and-Drop Grid
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instagram, LinkedIn & X
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> PDF, CSV & JSON Export
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Platform Adaptation Showcase */}
      <section id="demo" className="py-16 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Cross-Platform Voice Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Same Core Idea, Completely Different Voice
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl mx-auto">
              See how PostWise-AI intelligently adapts the same weekly wellness topic into platform-native formats.
            </p>

            {/* Platform switcher tabs */}
            <div className="inline-flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs mt-6">
              <button
                onClick={() => setActivePlatformTab('Instagram')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePlatformTab === 'Instagram'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram (Conversational & Emojis)</span>
              </button>
              <button
                onClick={() => setActivePlatformTab('LinkedIn')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePlatformTab === 'LinkedIn'
                    ? 'bg-[#0A66C2] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn (Professional & Value)</span>
              </button>
              <button
                onClick={() => setActivePlatformTab('X/Twitter')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activePlatformTab === 'X/Twitter'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X / Twitter (Punchy & Short)</span>
              </button>
            </div>
          </div>

          {/* Simulated Post Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 md:p-8 max-w-2xl mx-auto transition-all animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                {currentPreview.tag}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {currentPreview.metric}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">{currentPreview.title}</h3>

            <div className="text-slate-700 whitespace-pre-line leading-relaxed text-xs sm:text-sm bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
              {currentPreview.content}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-indigo-600 font-semibold">{currentPreview.hashtags}</span>
              <button
                onClick={() => navigate('/calendar')}
                className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
              >
                <span>Edit in Workspace</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Engineered for Creators & Brands
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Everything You Need to Dominate Social Media
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Built from the ground up according to the hackathon problem brief.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Drag-and-Drop Rescheduling</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reschedule any post by dragging it directly between dates on the interactive 30-day monthly grid. Status updates and syncs immediately.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <RotateCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Individual Post Regeneration</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Don’t like a particular idea? Click refresh on any individual post card to generate alternative copy without resetting your entire calendar.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">1-Click Multi-Format Export</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export your finished 30-day plan into printable PDF roadmaps for stakeholders, CSV spreadsheets for scheduling tools, or clean JSON payloads.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Platform-Specific Voice Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automatically structures emoji-rich captions for Instagram, professional ROI frameworks for LinkedIn, and snappy concise hooks for X.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Predictive Analytics Dashboard</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              View estimated impressions, platform distribution breakdown, and best times to post heatmaps to optimize your publishing strategy.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-subtle hover:shadow-card transition-all">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">Multiple Brand Personas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Manage multiple client or company brand profiles with custom niches, audience targets, tones of voice, and platform handles.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Generate Your 30-Day Content Roadmap?
          </h2>
          <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
            Experience the full hackathon prototype live with interactive drag-and-drop, individual AI post refresh, and instant export.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Launch PostWise-AI Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100 text-center text-xs text-slate-400">
        <p>PostWise-AI • AI Social Media Content Calendar Generator • Hackathon Submission 2026</p>
      </footer>
    </div>
  );
};

export default LandingPage;
