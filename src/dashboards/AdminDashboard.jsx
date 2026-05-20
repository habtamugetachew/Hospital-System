import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout, { MotionCard3D } from '../components/DashboardLayout';
import { Users, Calendar, Activity, Bed, Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    appointmentsToday: 0,
    activeDoctors: 0,
    occupiedBeds: 0
  });

  // Track the actual active sidebar tab dynamically
  const [activeTab, setActiveTab] = useState('dashboard');

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('patient');
  const [dept, setDept] = useState('');
  const [spec, setSpec] = useState('');

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = [];
      snapshot.forEach((doc) => {
        usersList.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersList);

      const doctorsCount = usersList.filter(u => u.role === 'doctor').length;
      setMetrics(prev => ({ ...prev, activeDoctors: doctorsCount }));
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const qAppointments = query(collection(db, 'appointments'), where('date', '==', todayStr));
    const unsubscribeAppts = onSnapshot(qAppointments, (snapshot) => {
      setMetrics(prev => ({ ...prev, appointmentsToday: snapshot.size }));
    });

    const qBeds = query(collection(db, 'users'), where('role', '==', 'patient'));
    const unsubscribeBeds = onSnapshot(qBeds, (snapshot) => {
      const occupied = Math.ceil(snapshot.size * 0.4);
      setMetrics(prev => ({ ...prev, occupiedBeds: occupied }));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeAppts();
      unsubscribeBeds();
    };
  }, []);

  const handleOpenAdd = () => {
    setEditUser(null);
    setName('');
    setEmail('');
    setRole('patient');
    setDept('');
    setSpec('');
    setShowForm(true);
  };

  const handleOpenEdit = (user) => {
    setEditUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setDept(user.department || '');
    setSpec(user.specialization || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return alert("Please fill all fields.");

    const userData = {
      name,
      email,
      role,
      department: role === 'doctor' ? dept : null,
      specialization: role === 'doctor' ? spec : null,
      updatedAt: new Date()
    };

    try {
      if (editUser) {
        await updateDoc(doc(db, 'users', editUser.id), userData);
        alert("User details updated successfully!");
      } else {
        await addDoc(collection(db, 'users'), {
          ...userData,
          createdAt: new Date()
        });
        alert("New user created successfully!");
      }
      setShowForm(false);
    } catch (err) {
      console.error("Error writing user document:", err);
      alert("Failed to save user: " + err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user profile?")) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user: " + err.message);
    }
  };

  // Define sidebar links specific to the Administrator role
  const sidebarLinks = [
    { id: 'dashboard', label: 'System Desk', icon: Activity },
    { id: 'directory', label: 'Access Directory', icon: Users },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarLinks={sidebarLinks}
      title="System Admin Workspace"
      subtitle={activeTab === 'dashboard' ? 'Hospital metrics dashboard, active beds, and patient checkins.' : 'Auditing, security logs, and user directory.'}
    >
      {/* Dynamic Tab Switch Render */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 fade-in">
          {/* Executive Metrics Grid using Framer Motion 3D Tilt Cards with Microscopic DNA overlays */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MotionCard3D className="relative p-6 flex items-center justify-between overflow-hidden">
              {/* Microscopic DNA watermark */}
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <img src="/medical_watermark.png" alt="DNA Watermark" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-2xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest">Active Visits Today</span>
                <h3 className="text-3xl font-extrabold">{metrics.appointmentsToday}</h3>
              </div>
              <div className="relative z-10 bg-cyan-500/10 p-3.5 rounded-2xl text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                <Calendar className="h-6 w-6" />
              </div>
            </MotionCard3D>

            <MotionCard3D className="relative p-6 flex items-center justify-between overflow-hidden">
              {/* Microscopic DNA watermark */}
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <img src="/medical_watermark.png" alt="DNA Watermark" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-2xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest">Active Doctors Portal</span>
                <h3 className="text-3xl font-extrabold">{metrics.activeDoctors}</h3>
              </div>
              <div className="relative z-10 bg-emerald-500/10 p-3.5 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Activity className="h-6 w-6" />
              </div>
            </MotionCard3D>

            <MotionCard3D className="relative p-6 flex items-center justify-between overflow-hidden">
              {/* Microscopic DNA watermark */}
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <img src="/medical_watermark.png" alt="DNA Watermark" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 space-y-1">
                <span className="text-2xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest">Occupied Admissions</span>
                <h3 className="text-3xl font-extrabold">{metrics.occupiedBeds} <span className="text-xs text-[var(--text-slate-muted)] font-semibold font-mono">/ 50 MAX</span></h3>
              </div>
              <div className="relative z-10 bg-amber-500/10 p-3.5 rounded-2xl text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Bed className="h-6 w-6" />
              </div>
            </MotionCard3D>
          </div>

          {/* Prompt card guiding the admin to directory for operations */}
          <div className="premium-glass-card rounded-[28px] p-8 text-center space-y-4 max-w-2xl mx-auto border border-[var(--glass-border)] shadow-md">
            <div className="mx-auto h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Need to Manage Accounts?</h3>
            <p className="text-sm text-[var(--text-slate-muted)] leading-relaxed">
              Use the sidebar panel to navigate to the **Access Directory** tab. From there, you can perform full CRUD operations (Add new specialist accounts, update secure profile details, or revoke clearances).
            </p>
            <button
              onClick={() => setActiveTab('directory')}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider uppercase transition interactive-hover"
            >
              Open Directory Manager
            </button>
          </div>
        </div>
      )}

      {activeTab === 'directory' && (
        <div className="premium-glass-card rounded-[28px] p-6 md:p-8 fade-in border border-[var(--glass-border)] shadow-lg">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Users className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">System Access Directory</h2>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold tracking-wider uppercase py-2.5 px-5 rounded-xl shadow-[0_4px_10px_rgba(0,242,254,0.2)] transition interactive-hover"
            >
              <Plus className="h-4 w-4" /> Add User Account
            </button>
          </div>

          {/* User Directory Table */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--glass-border)] text-[var(--text-slate-muted)] font-bold uppercase tracking-wider text-xs">
                  <th className="py-4 px-4.5">Account User</th>
                  <th className="py-4 px-4.5">Secure Email</th>
                  <th className="py-4 px-4.5">Authorization Role</th>
                  <th className="py-4 px-4.5">Assigned Dept</th>
                  <th className="py-4 px-4.5 text-center">Directory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)] text-[var(--text-primary)]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/2 dark:hover:bg-white/2 light:hover:bg-slate-100 transition duration-200">
                    <td className="py-4 px-4.5 font-bold flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 dark:text-cyan-400 light:text-cyan-600 font-black uppercase text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold">{user.name}</span>
                    </td>
                    <td className="py-4 px-4.5 font-medium">{user.email}</td>
                    <td className="py-4 px-4.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase tracking-wider border ${
                        user.role === 'admin' ? 'bg-rose-500/10 text-rose-400 dark:text-rose-400 light:text-rose-600 border-rose-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]' :
                        user.role === 'doctor' ? 'bg-cyan-500/10 text-cyan-400 dark:text-cyan-400 light:text-cyan-600 border-cyan-500/20 shadow-[0_0_10px_rgba(0,242,254,0.1)]' :
                        user.role === 'staff' ? 'bg-amber-500/10 text-amber-400 dark:text-amber-400 light:text-amber-600 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                        'bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-600 border-slate-700/50'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="font-semibold">{user.department || '-'}</td>
                    <td className="py-4 px-4.5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 hover:bg-slate-800/80 dark:hover:bg-slate-800/80 light:hover:bg-slate-200 rounded-xl border border-transparent hover:border-cyan-500/20 text-[var(--text-slate-muted)] hover:text-cyan-500 transition"
                          title="Modify Account"
                        >
                          <Pencil className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 hover:bg-slate-800/80 dark:hover:bg-slate-800/80 light:hover:bg-slate-200 rounded-xl border border-transparent hover:border-rose-500/20 text-[var(--text-slate-muted)] hover:text-rose-500 transition"
                          title="Revoke Account"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Access Form Dialog Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[32px] p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative text-[var(--text-primary)]">
            <h3 className="text-xl font-bold tracking-tight border-b border-[var(--glass-border)] pb-3">
              {editUser ? 'Modify Access Credentials' : 'Add Access Account'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/60"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Secure Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@healthcare.com"
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/60"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Security Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-3 text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/60"
                >
                  <option value="patient">Patient Profile</option>
                  <option value="doctor">Doctor Portal</option>
                  <option value="staff">Lab & Pharmacy Staff</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              {role === 'doctor' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Department</label>
                    <select
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-3 text-xs text-[var(--text-primary)] focus:outline-none"
                      required
                    >
                      <option value="">Choose Dept</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Dermatology">Dermatology</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Specialization</label>
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => setSpec(e.target.value)}
                      placeholder="e.g. Chief Surgeon"
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3.5 py-3 text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--glass-border)]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200 text-3xs font-bold tracking-wider uppercase py-2 px-4 rounded-xl transition text-[var(--text-slate-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-3xs font-bold tracking-wider uppercase py-2 px-4 rounded-xl transition shadow-sm text-white"
                >
                  {editUser ? 'Update Account' : 'Register Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
