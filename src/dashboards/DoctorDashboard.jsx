import React, { useState, useEffect } from 'react';
import { db, collection, query, where, onSnapshot } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import EHRForm from '../components/EHRForm';
import DashboardLayout, { MotionCard3D } from '../components/DashboardLayout';
import { UserCheck, ListOrdered, Users, Clock, Activity } from 'lucide-react';

export default function DoctorDashboard() {
  const { currentUser, userData } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('queue'); // queue, consultation

  useEffect(() => {
    if (!currentUser.uid) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'appointments'),
      where('doctorId', '==', currentUser.uid),
      where('date', '==', todayStr)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appts = [];
      snapshot.forEach((doc) => {
        appts.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appts);
    }, (err) => {
      console.error("Error listening to doctor appointments: ", err);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  // Define sidebar navigation tabs for clinical specialists
  const sidebarLinks = [
    { id: 'queue', label: 'Patient Queue', icon: ListOrdered },
    { id: 'consultation', label: 'EHR Consultation', icon: UserCheck },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarLinks={sidebarLinks}
      title={`Welcome back, Dr. ${userData?.name?.split(' ')[1] || 'Sarah'} 👋`}
      subtitle={activeTab === 'queue' ? 'Real-time patient visits, queue schedules, and checklist summaries.' : 'Diagnose clinical conditions and dispatch digital prescriptions.'}
    >
      {/* Patient Queue View */}
      {activeTab === 'queue' && (
        <div className="space-y-6 fade-in">
          {/* Quick Metrics in 3D Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MotionCard3D className="p-5.5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest">Total Consultations</span>
                <h3 className="text-2xl font-extrabold">{appointments.length}</h3>
              </div>
              <div className="bg-cyan-500/10 p-2.5 rounded-xl text-cyan-400">
                <Users className="h-5.5 w-5.5" />
              </div>
            </MotionCard3D>
            
            <MotionCard3D className="p-5.5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest">Pending Checkins</span>
                <h3 className="text-2xl font-extrabold">{appointments.filter(a => a.status === 'pending').length}</h3>
              </div>
              <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400">
                <Clock className="h-5.5 w-5.5" />
              </div>
            </MotionCard3D>
            
            <MotionCard3D className="p-5.5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest">Completed Today</span>
                <h3 className="text-2xl font-extrabold text-emerald-400">{appointments.filter(a => a.status === 'completed').length}</h3>
              </div>
              <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400">
                <Activity className="h-5.5 w-5.5" />
              </div>
            </MotionCard3D>
          </div>

          <div className="premium-glass-card rounded-[28px] p-6 md:p-8">
            <h2 className="text-lg font-bold tracking-tight mb-5">Patient Appointment Queue</h2>
            
            {appointments.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/20 border border-[var(--glass-border)] rounded-2xl">
                <div className="mx-auto h-12 w-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 mb-4 animate-pulse">
                  <ListOrdered className="h-5.5 w-5.5" />
                </div>
                <p className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">No active patient bookings today</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  When patients register for cardiology/general consultation visits, they will populate here in real-time.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[var(--glass-border)] text-[var(--text-slate-muted)] font-bold uppercase tracking-wider text-xs">
                      <th className="py-4 px-4.5">Patient Details</th>
                      <th className="py-4 px-4.5">Time Schedule</th>
                      <th className="py-4 px-4.5">Admissions Status</th>
                      <th className="py-4 px-4.5 text-right">Consultation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--glass-border)]">
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-white/2 dark:hover:bg-white/2 light:hover:bg-slate-100 transition duration-200">
                        <td className="py-4.5 px-4.5 font-bold flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 dark:text-cyan-400 light:text-cyan-600 font-black uppercase text-xs">
                            {appt.patientName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold">{appt.patientName}</span>
                            <span className="block text-3xs text-[var(--text-slate-muted)] font-mono mt-0.5">ID: {appt.id.substr(0, 10)}</span>
                          </div>
                        </td>
                        <td className="py-4.5 px-4.5 font-medium">{appt.timeSlot}</td>
                        <td className="py-4.5 px-4.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-extrabold uppercase tracking-wider border ${
                            appt.status === 'completed' 
                              ? 'bg-emerald-500/10 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                              : 'bg-amber-500/10 text-amber-400 dark:text-amber-400 light:text-amber-600 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${appt.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                            {appt.status}
                          </span>
                        </td>
                        <td className="py-4.5 px-4.5 text-right">
                          <button
                            onClick={() => setActiveTab('consultation')}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition duration-300 interactive-hover shadow-sm"
                          >
                            Launch EHR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'consultation' && (
        <div className="fade-in">
          <EHRForm />
        </div>
      )}
    </DashboardLayout>
  );
}
