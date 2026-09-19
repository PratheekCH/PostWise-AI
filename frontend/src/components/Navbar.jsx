import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Building2, 
  ChevronDown, 
  PlusCircle, 
  LogOut, 
  Check, 
  Layers
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onOpenAiGenerator }) => {
  const { user, logout, brands, activeBrand, selectActiveBrand } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 py-3 sticky top-0 z-30 flex items-center justify-between shadow-subtle transition-colors">
      {/* Left Area: Active Brand Selector & Breadcrumbs */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-200 text-sm font-semibold shadow-xs cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="max-w-[140px] md:max-w-[200px] truncate font-bold">
                {activeBrand ? activeBrand.name : 'Select Brand Profile'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-1" />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-popover z-50 animate-scale-in">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Select Brand Workspace
                </div>
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto my-1">
                  {brands && brands.length > 0 ? (
                    brands.map((b) => {
                      const isSelected = activeBrand && activeBrand._id === b._id;
                      return (
                        <div
                          key={b._id}
                          onClick={() => {
                            selectActiveBrand(b);
                            setDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-sm transition-colors ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: b.color || '#4f46e5' }}
                            />
                            <div className="truncate">
                              <p className="font-semibold text-xs leading-tight">{b.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{b.niche || b.industry}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-xs text-slate-400">No brands configured</div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/brand');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Configure Brand Profiles
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>•</span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            3 Platforms Active: IG, LinkedIn, X
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Main CTA: Generate AI Calendar */}
        <button
          onClick={onOpenAiGenerator || (() => navigate('/generate'))}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm shadow-indigo-500/25 transition-all transform active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generate AI Calendar</span>
        </button>

        {/* Shadcn UI Dark/Light Theme Toggle */}
        <ThemeToggle />

        {/* User profile dropdown pill */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{user.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">{user.company || 'Creator'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
