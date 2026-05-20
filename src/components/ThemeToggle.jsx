import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative h-10 w-20 rounded-full p-1 cursor-pointer transition-all duration-500 flex items-center shadow-inner ${
        isDark 
          ? 'bg-slate-900 border border-white/5' 
          : 'bg-cyan-100 border border-cyan-200'
      }`}
      aria-label="Toggle Global Portal Theme"
    >
      {/* Track Background highlights */}
      <span className={`absolute inset-0 rounded-full transition-opacity duration-500 ${
        isDark ? 'bg-gradient-to-r from-indigo-950/40 to-slate-900/40 opacity-100' : 'bg-gradient-to-r from-amber-100 to-cyan-50 opacity-0'
      }`}></span>

      {/* Dynamic Animated Sliding Orb */}
      <span
        className={`relative z-10 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) transform ${
          isDark 
            ? 'translate-x-10 bg-gradient-to-tr from-cyan-600 to-indigo-600 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.4)] rotate-[360deg]' 
            : 'translate-x-0 bg-white text-amber-500 shadow-[0_4px_10px_rgba(245,158,11,0.2)] rotate-0'
        }`}
      >
        {isDark ? (
          <Moon className="h-4.5 w-4.5 animate-pulse" />
        ) : (
          <Sun className="h-4.5 w-4.5 animate-spin-slow" />
        )}
      </span>

      {/* Decorative sun/moon indicators on opposite track sides */}
      <span className="absolute left-2.5 text-amber-500 text-3xs font-extrabold uppercase tracking-widest select-none pointer-events-none transition-opacity duration-300 opacity-100 dark:opacity-0">
        <Sun className="h-3 w-3 inline" />
      </span>
      <span className="absolute right-2.5 text-cyan-400 text-3xs font-extrabold uppercase tracking-widest select-none pointer-events-none transition-opacity duration-300 opacity-0 dark:opacity-100">
        <Moon className="h-3 w-3 inline" />
      </span>
    </button>
  );
}
