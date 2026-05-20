import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

// Dashboards
import AdminDashboard from './dashboards/AdminDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import PatientDashboard from './dashboards/PatientDashboard';
import LabPharmacyDashboard from './dashboards/LabPharmacyDashboard';

// Icons for portal
import { Stethoscope, Lock, Mail, KeyRound, ShieldAlert } from 'lucide-react';

function Login() {
  const { login, userRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect user to their respective dashboard when logged in & role is loaded
  useEffect(() => {
    if (userRole) {
      switch (userRole) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'doctor':
          navigate('/doctor', { replace: true });
          break;
        case 'patient':
          navigate('/patient', { replace: true });
          break;
        case 'staff':
          navigate('/staff', { replace: true });
          break;
        default:
          setError('Access role unauthorized. Contact IT Department.');
          break;
      }
    }
  }, [userRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError('Invalid email or password credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-[var(--primary-bg)] text-[var(--text-primary)] transition-colors duration-500">
      {/* Parallax Cinematic Hospital Hallway Background Cover */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hospital_hallway.png" 
          alt="Modern Hospital Hallway" 
          className="w-full h-full object-cover scale-105 pointer-events-none transform -translate-y-2 select-none"
        />
        {/* Custom Gradient Mask Overlay: Fades dynamically from transparent to Deep Space Blue or Soft Cloud depending on current theme */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary-bg)] via-[var(--primary-bg)]/80 to-[var(--primary-bg)]/50 backdrop-blur-[6px] transition-colors duration-500"></div>
      </div>

      {/* Floating Theme Switcher top right */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md premium-glass-card rounded-[32px] p-8 md:p-10 space-y-8 fade-in relative z-10 border border-[var(--glass-border)] shadow-2xl">
        
        {/* Portal Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 dark:text-cyan-400 light:text-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-pulse">
            <Stethoscope className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight neon-glow-text">HealthCare HMS</h2>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-slate-muted)] mt-1">Clinical Enterprise Portal</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl text-xs font-semibold text-center flex items-center gap-2 justify-center">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider ml-1">Portal Account Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. doctor@healthcare.com"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition duration-300 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider ml-1">Secure Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition duration-300 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Action Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-4 rounded-2xl shadow-[0_4px_20px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.4)] transition-all duration-300 interactive-hover"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Verifying Security...
                </>
              ) : (
                'Secure Sign In'
              )}
            </span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[var(--glass-border)]">
          <p className="text-2xs text-[var(--text-slate-muted)] font-mono tracking-wider">
            SECURED END-TO-END VIA CLOUD DIRECTORY SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 bg-[var(--primary-bg)] text-[var(--text-primary)] overflow-hidden transition-colors duration-500">
      {/* Background ambient light blobs */}
      <div className="bg-glow-orbs">
        <div className="orb-cyan"></div>
        <div className="orb-purple"></div>
      </div>

      {/* Floating Theme Switcher top right */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md premium-glass-card rounded-[32px] p-8 md:p-10 text-center space-y-6 fade-in relative z-10">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-bounce">
          <Lock className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Access Authorization Denied</h2>
          <p className="text-sm text-[var(--text-slate-muted)] leading-relaxed max-w-sm mx-auto">
            You do not possess the required clinical clearance or security role credentials to enter this workstation.
          </p>
        </div>
        <div className="pt-2 border-t border-[var(--glass-border)]">
          <a
            href="/login"
            className="inline-block bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold py-3 px-8 rounded-xl transition interactive-hover"
          >
            Back to Portal Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Role-Based Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <LabPharmacyDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route redirects to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
