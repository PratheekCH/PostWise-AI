import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Sparkles, 
  BarChart3, 
  Wand2, 
  ExternalLink,
  ChevronRight,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const { activeBrand, brands, selectActiveBrand } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/calendar', label: 'Content Calendar', icon: Calendar, badge: 'Main' },
    { to: '/generate', label: 'AI Generator', icon: Wand2, highlight: true },
    { to: '/brand', label: 'Brand Profile', icon: Building2 },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 p-4 flex flex-col justify-between min-h-screen sticky top-0 shadow-sm transition-colors">
      <div className="flex flex-col gap-6">
        {/* Brand/App Title Header */}
        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-bold text-lg">
            P
          </div>
          <div>
            <div className="font-display font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
              PostWise<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">.ai</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Smart Social Calendar</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col gap-1">
          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100 dark:border-indigo-900/60'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Brand Switcher in Sidebar */}
        <div className="px-1">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Active Brand</span>
            <button 
              onClick={() => navigate('/brand')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-[10px] font-bold cursor-pointer"
            >
              Manage
            </button>
          </div>
          <div className="mt-1 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-2.5 border border-slate-200/70 dark:border-slate-800">
            {activeBrand ? (
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-slate-900 dark:text-slate-200 truncate">
                    {activeBrand.name}
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800 font-medium">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  Tone: {activeBrand.tone}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                    IG
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                    LinkedIn
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                    X
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">No brand selected</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Theme switch & Links */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
        {/* Dark Mode Switch Row */}
        <div className="flex items-center justify-between px-3 py-1 text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-slate-400 dark:text-indigo-400" />
            Dark Mode
          </span>
          <ThemeToggle variant="switch" />
        </div>

        <NavLink
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Landing Page
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
        </NavLink>
        
        <div className="px-3 py-2 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50/50 dark:from-indigo-950/40 dark:to-violet-950/30 border border-indigo-100/60 dark:border-indigo-900/40 text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            Hackathon Edition
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">30-Day AI Generation Ready</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
