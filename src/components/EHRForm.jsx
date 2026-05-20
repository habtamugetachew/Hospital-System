import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, query, where, Timestamp } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Plus, Trash2, Send, CheckCircle2, User, ChevronRight, Scan } from 'lucide-react';
import StaticHoloScanner from './StaticHoloScanner';

export default function EHRForm() {
  const { currentUser, userData } = useAuth();
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePartSelect = (part) => {
    setDiagnosis(prev => prev ? `${prev}\n[System Scan Detected]: ${part}` : `[System Scan Detected]: ${part}`);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'patient'));
        const querySnapshot = await getDocs(q);
        const patientsList = [];
        querySnapshot.forEach((doc) => {
          patientsList.push({ id: doc.id, ...doc.data() });
        });
        setPatients(patientsList);
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };
    fetchPatients();
  }, []);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  const handleRemoveMedicine = (index) => {
    const updated = [...medicines];
    updated.splice(index, 1);
    setMedicines(updated);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) return alert("Please select a patient.");
    if (!diagnosis.trim()) return alert("Please enter a diagnosis.");
    
    setLoading(true);
    setSuccess(false);

    try {
      const selectedPatient = patients.find(p => p.id === selectedPatientId);
      
      const prescriptionData = {
        patientId: selectedPatientId,
        patientName: selectedPatient ? selectedPatient.name : 'Unknown Patient',
        doctorId: currentUser.uid,
        doctorName: userData?.name || 'Dr. Sarah Jenkins',
        date: Timestamp.now(),
        diagnosis: diagnosis,
        medicines: medicines.filter(m => m.name.trim() !== ''),
        status: 'pending_dispense'
      };

      await addDoc(collection(db, 'prescriptions'), prescriptionData);

      setSuccess(true);
      setDiagnosis('');
      setMedicines([{ name: '', dosage: '', duration: '' }]);
      setSelectedPatientId('');
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Error saving EHR prescription:", err);
      alert("Failed to submit EHR record: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 fade-in">
      {/* 3D Anatomy View */}
      <div className="premium-glass-card rounded-[28px] p-6 md:p-8 shadow-xl flex flex-col min-h-[600px] border border-[var(--glass-border)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-500/10 p-2.5 rounded-xl text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] animate-pulse">
            <Scan className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">Holographic Anatomy Scan</h2>
            <p className="text-xs text-slate-400 mt-0.5">Interactive 3D diagnostics mapping</p>
          </div>
        </div>
        <div className="hidden xl:block h-[800px] sticky top-6">
          <StaticHoloScanner />
        </div>
      </div>

      {/* EHR Form */}
      <div className="premium-glass-card rounded-[28px] p-6 md:p-8 shadow-xl text-white border border-[var(--glass-border)]">
        <div className="flex items-center gap-4 border-b border-white/5 pb-5 mb-6">
          <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">EHR Console</h2>
            <p className="text-xs text-slate-400 mt-0.5">Author diagnostic findings and prescriptions.</p>
          </div>
        </div>

      {success && (
        <div className="mb-6 flex items-center gap-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4.5 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 animate-bounce" />
          <p className="text-xs font-bold tracking-wide">Consultation session saved! Prescription dispatched to pharmacy in real-time.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Select Patient File</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition shadow-inner"
                required
              >
                <option value="">-- Choose Admitted Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-950">
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Diagnosis Area */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">Clinical Assessment & Diagnosis</label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            rows={4}
            placeholder="Document vital signs, symptoms, clinical notes, and precise patient diagnosis..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition resize-none shadow-inner"
            required
          ></textarea>
        </div>

        {/* Prescription Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase">Dispensary Prescription Items</h3>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-2xs py-2 px-4 rounded-xl shadow-sm transition duration-300 interactive-hover"
            >
              <Plus className="h-3.5 w-3.5" /> Add Medicine Row
            </button>
          </div>

          <div className="space-y-4">
            {medicines.map((med, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-900/40 border border-white/5 p-4 rounded-2xl shadow-inner">
                <div className="md:col-span-5 space-y-1">
                  <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider ml-1">Medicine Name</label>
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/60"
                    required
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider ml-1">Dosage Routine</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    placeholder="e.g. 1 tab, 3x daily"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/60"
                    required
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="block text-3xs font-bold text-slate-400 uppercase tracking-wider ml-1">Duration</label>
                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    placeholder="e.g. 7 Days"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500/60"
                    required
                  />
                </div>
                <div className="md:col-span-1 flex justify-center pb-1">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(index)}
                    disabled={medicines.length === 1}
                    className="p-2.5 rounded-xl bg-slate-950/40 border border-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-5 border-t border-white/5">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 px-7 rounded-2xl shadow-[0_4px_15px_rgba(6,182,212,0.2)] transition-all duration-300 interactive-hover disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Saving Record...
              </>
            ) : (
              <>
                <Send className="h-4.5 w-4.5" /> Dispatch Consultation Records
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
