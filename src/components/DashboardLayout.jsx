import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { LogOut, Shield, Stethoscope, FileText, Package, Users, Menu, X } from 'lucide-react';

/**
 * Ultra-Premium 3D Perspective Tilt Card using Framer Motion Spring Physics.
 * Creates an organic sci-fi hover and float effect.
 */
export function MotionCard3D({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse positions to 3D rotation degrees
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  // Spring physics constants for smooth, tactile transitions
  const springX = useSpring(rotateX, { stiffness: 120, damping: 15 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 15 });

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Coordinates relative to card center
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`premium-glass-card cursor-pointer border border-[var(--glass-border)] ${className}`}
    >
      {/* 3D Translation depth for inner child elements */}
      <div style={{ transform: 'translateZ(30px)' }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * Global Dashboard Layout Shell
 * Integrates interactive glowing backgrounds, collapsible animated sidebar,
 * top bar with ThemeToggle, and full responsive support.
 */
export default function DashboardLayout({ children, activeTab, setActiveTab, sidebarLinks = [], title, subtitle }) {
  const { logout, userData } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="relative min-h-screen bg-[var(--primary-bg)] text-[var(--text-primary)] flex overflow-hidden transition-colors duration-500">
      {/* Background sci-fi ambient glowing orbs */}
      <div className="bg-glow-orbs">
        <div className="orb-cyan"></div>
        <div className="orb-purple"></div>
      </div>

      {/* Animated Sidebar using Framer Motion */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 0, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="shrink-0 bg-[var(--sidebar-bg)] backdrop-blur-xl border-r border-[var(--glass-border)] flex flex-col p-6 z-20 transition-colors duration-500 h-screen overflow-hidden"
      >
        {/* Sidebar Header Brand */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 dark:text-cyan-400 light:text-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Stethoscope className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-wide neon-glow-text">HealthCare</span>
              <p className="text-3xs uppercase tracking-widest font-mono text-[var(--text-slate-muted)] font-bold">Clinical Workspace</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* User Identity Profile Card */}
        <div className="my-6 p-4.5 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-[var(--glass-border)] shadow-inner shrink-0 text-center">
          {userData?.role === 'doctor' ? (
            <div className="relative w-16 h-16 mx-auto mb-3 rounded-full border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(0,242,254,0.4)] overflow-hidden transition duration-300 hover:scale-105">
              <img src="/doctor_portrait.png" alt="Dr. Sarah Jenkins" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="relative w-16 h-16 mx-auto mb-3 rounded-full border border-[var(--glass-border)] bg-[var(--input-bg)] flex items-center justify-center text-cyan-400 font-extrabold text-sm shadow-md">
              {userData?.name?.charAt(0) || 'U'}
            </div>
          )}
          <p className="text-3xs text-slate-500 uppercase tracking-widest font-bold font-mono">Session Identity</p>
          <h4 className="font-bold text-white mt-1 text-sm">{userData?.name || 'Jane Doe'}</h4>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-3xs font-extrabold tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
            {userData?.role || 'Portal'}
          </span>
        </div>

        {/* Dynamic Sidebar Links */}
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isSelected = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                  isSelected
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'hover:bg-slate-800/40 dark:hover:bg-slate-800/40 light:hover:bg-slate-200 border border-transparent text-[var(--text-slate-muted)] hover:text-white dark:hover:text-white light:hover:text-slate-900'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Global theme switcher and logout action */}
        <div className="pt-6 border-t border-[var(--glass-border)] space-y-4 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-slate-muted)] hover:text-rose-500 font-bold py-3 px-4 rounded-2xl transition duration-300 text-xs tracking-wider uppercase interactive-hover"
          >
            <LogOut className="h-4 w-4" /> Logout Session
          </button>
        </div>
      </motion.aside>

      {/* Main clinical deck layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Floating Header */}
        <header className="border-b border-[var(--glass-border)] bg-[var(--sidebar-bg)] backdrop-blur-xl px-6 md:px-10 py-5 flex items-center justify-between z-10 transition-colors duration-500 shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-slate-800/50 rounded-xl border border-[var(--glass-border)] text-[var(--text-slate-muted)]"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">{title || 'Clinical Dashboard'}</h1>
              {subtitle && <p className="text-xs text-[var(--text-slate-muted)] hidden md:block">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Header identity backup or extra toggle */}
            <ThemeToggle />
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-slate-muted)] hover:text-rose-500 font-bold py-2 px-3.5 rounded-xl transition text-xs tracking-wider uppercase interactive-hover"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </header>

        {/* Dashboards active inner children view */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8 z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
