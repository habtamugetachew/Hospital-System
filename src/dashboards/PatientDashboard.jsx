import React, { useState, useEffect } from 'react';
import { db, collection, query, where, onSnapshot } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import AppointmentBooking from '../components/AppointmentBooking';
import DashboardLayout, { MotionCard3D } from '../components/DashboardLayout';
import { FileText, PlusCircle, Calendar, BrainCircuit } from 'lucide-react';
import AITriage from '../components/AITriage';

export default function PatientDashboard() {
  const { currentUser, userData } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('records'); // records, booking

  useEffect(() => {
    if (!currentUser.uid) return;

    const qPresc = query(collection(db, 'prescriptions'), where('patientId', '==', currentUser.uid));
    const unsubscribePresc = onSnapshot(qPresc, (snapshot) => {
      const prescList = [];
      snapshot.forEach((doc) => {
        prescList.push({ id: doc.id, ...doc.data() });
      });
      setPrescriptions(prescList);
    }, (err) => console.error("Error loading prescriptions:", err));

    const qAppts = query(collection(db, 'appointments'), where('patientId', '==', currentUser.uid));
    const unsubscribeAppts = onSnapshot(qAppts, (snapshot) => {
      const apptsList = [];
      snapshot.forEach((doc) => {
        apptsList.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(apptsList);
    }, (err) => console.error("Error loading appointments:", err));

    return () => {
      unsubscribePresc();
      unsubscribeAppts();
    };
  }, [currentUser.uid]);

  // Sidebar links specific to the patient profile
  const sidebarLinks = [
    { id: 'records', label: 'Medical History', icon: FileText },
    { id: 'triage', label: 'AI Symptom Checker', icon: BrainCircuit },
    { id: 'booking', label: 'Book Appointment', icon: PlusCircle },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarLinks={sidebarLinks}
      title={`Hello, ${userData?.name?.split(' ')[0] || 'Patient'} 👋`}
      subtitle={activeTab === 'records' ? 'Smart clinical outcomes, diagnostic notes, and treatment summaries.' : 'Secure doctor booking portal and live schedule slots.'}
    >
      {activeTab === 'records' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
          {/* Treatment & Prescription History */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold tracking-tight">Prescription & Consultation Records</h2>
            
            {prescriptions.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/20 border border-[var(--glass-border)] rounded-[28px]">
                <div className="mx-auto h-12 w-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 mb-4 animate-pulse">
                  <FileText className="h-5.5 w-5.5" />
                </div>
                <p className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">No medical history records found</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Consultation notes and digital drug prescriptions written by clinical doctors will reflect here automatically in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((presc) => (
                  <MotionCard3D key={presc.id} className="p-6 space-y-5">
                    <div className="flex justify-between items-start border-b border-[var(--glass-border)] pb-3.5">
                      <div>
                        <span className="text-3xs uppercase tracking-widest font-mono text-cyan-400 font-bold">Diagnosed Condition</span>
                        <h3 className="font-extrabold text-[var(--text-primary)] text-base mt-0.5">{presc.diagnosis}</h3>
                        <p className="text-2xs text-[var(--text-slate-muted)] font-semibold mt-1">Physician in Charge: {presc.doctorName}</p>
                      </div>
                      <span className="text-3xs text-[var(--text-slate-muted)] font-bold font-mono">
                        {presc.date && typeof presc.date === 'string' 
                          ? new Date(presc.date).toLocaleDateString() 
                          : (presc.date?.toDate ? presc.date.toDate().toLocaleDateString() : 'Today')}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-3xs font-extrabold text-[var(--text-slate-muted)] uppercase tracking-widest font-mono">Prescribed Treatment Details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {presc.medicines.map((med, idx) => (
                          <div key={idx} className="bg-[var(--input-bg)] border border-[var(--input-border)] p-4 rounded-2xl flex flex-col justify-center shadow-inner">
                            <span className="text-sm font-bold">{med.name}</span>
                            <span className="text-2xs text-[var(--text-slate-muted)] font-semibold mt-1">Dosage: {med.dosage}</span>
                            <span className="text-3xs text-cyan-400 font-semibold mt-0.5">Duration: {med.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </MotionCard3D>
                ))}
              </div>
            )}
          </div>

          {/* Smart Schedules Sidebar */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold tracking-tight">Clinical Bookings</h2>
            
            {appointments.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/20 border border-[var(--glass-border)] rounded-[28px]">
                <Calendar className="h-7 w-7 text-slate-700 mx-auto mb-3" />
                <p className="text-xs text-slate-500 font-semibold">No active medical visits</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <MotionCard3D key={appt.id} className="p-5 flex items-center justify-between shadow-sm">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider">{appt.doctorName}</h4>
                      <p className="text-3xs text-cyan-400 font-bold uppercase">{appt.department}</p>
                      <p className="text-3xs text-[var(--text-slate-muted)] font-semibold mt-1">{appt.date} | {appt.timeSlot}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-3xs font-extrabold uppercase tracking-wider border ${
                      appt.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                        : 'bg-amber-500/10 text-amber-400 dark:text-amber-400 light:text-amber-600 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                    }`}>
                      {appt.status}
                    </span>
                  </MotionCard3D>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'booking' && (
        <div className="fade-in">
          <AppointmentBooking />
        </div>
      )}

      {activeTab === 'triage' && (
        <div className="fade-in max-w-4xl mx-auto">
          <AITriage />
        </div>
      )}
    </DashboardLayout>
  );
}
