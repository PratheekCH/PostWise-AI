import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '', variant = 'button' }) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
          isDark ? 'bg-indigo-600' : 'bg-slate-200'
        } ${className}`}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            isDark ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {isDark ? (
            <Moon className="h-3 w-3 text-indigo-600" />
          ) : (
            <Sun className="h-3 w-3 text-amber-500" />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-xs transition-all cursor-pointer ${className}`}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggle;
