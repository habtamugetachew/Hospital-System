import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, query, where, Timestamp } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, User, Clock, ArrowRight, ArrowLeft, Check, Compass, Star } from 'lucide-react';

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'General Medicine',
  'Dermatology'
];

const TIME_SLOTS = [
  '09:00 AM - 09:30 AM',
  '10:00 AM - 10:30 AM',
  '11:00 AM - 11:30 AM',
  '02:00 PM - 02:30 PM',
  '03:00 PM - 03:30 PM',
  '04:00 PM - 04:30 PM'
];

export default function AppointmentBooking() {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  
  const [selectedDept, setSelectedDept] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!selectedDept) {
      setDoctors([]);
      return;
    }

    const fetchDoctorsInDept = async () => {
      try {
        const q = query(
          collection(db, 'users'), 
          where('role', '==', 'doctor'), 
          where('department', '==', selectedDept)
        );
        const querySnapshot = await getDocs(q);
        const docsList = [];
        querySnapshot.forEach((doc) => {
          docsList.push({ id: doc.id, ...doc.data() });
        });
        setDoctors(docsList);
      } catch (err) {
        console.error("Error fetching doctors in department:", err);
      }
    };
    fetchDoctorsInDept();
  }, [selectedDept]);

  const handleNextStep = () => {
    if (step === 1 && !selectedDept) return alert("Please select a medical department.");
    if (step === 2 && !selectedDoctorId) return alert("Please select a doctor.");
    if (step === 3 && (!selectedDate || !selectedSlot)) return alert("Please choose a date and a time slot.");
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const selectedDocObj = doctors.find(d => d.id === selectedDoctorId);
      
      const appointmentData = {
        patientId: currentUser.uid,
        patientName: currentUser.displayName || 'Patient Name',
        doctorId: selectedDoctorId,
        doctorName: selectedDocObj ? selectedDocObj.name : 'Dr. Sarah Jenkins',
        department: selectedDept,
        date: selectedDate,
        timeSlot: selectedSlot,
        status: 'pending',
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      
      setBookingSuccess(true);
      setStep(4);
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to submit appointment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDept('');
    setSelectedDoctorId('');
    setSelectedDate('');
    setSelectedSlot('');
    setBookingSuccess(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto premium-glass-card rounded-[28px] overflow-hidden p-6 md:p-8 shadow-2xl text-white fade-in border border-[var(--glass-border)]">
      {/* Photorealistic MRI Diagnostic Room Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <img src="/mri_scanner.png" alt="MRI Scanner Lab" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/75 to-transparent"></div>
      </div>
      
      <div className="relative z-10">
      {/* Header and Progress Tracker */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-9 w-9 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400">
              <Compass className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Book Clinical Appointment</h2>
          </div>
          <div className="flex items-center justify-between relative px-2.5">
            <div className="absolute left-6 right-6 top-4 h-[2px] bg-slate-800 -z-10"></div>
            {[
              { num: 1, label: 'Department' },
              { num: 2, label: 'Specialist' },
              { num: 3, label: 'Schedule' }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-2 bg-slate-900/60 px-3.5 rounded-2xl py-1 backdrop-blur-md">
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step === s.num 
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20' 
                    : step > s.num 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-800 text-slate-400 border border-white/5'
                }`}>
                  {step > s.num ? <Check className="h-4 w-4" /> : s.num}
                </div>
                <span className={`text-3xs font-extrabold uppercase tracking-wider ${step === s.num ? 'text-cyan-400' : 'text-slate-500'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Select Department */}
      {step === 1 && (
        <div className="space-y-6 fade-in">
          <h3 className="text-sm font-bold tracking-widest text-slate-300 uppercase ml-1">Select Medical Specialty</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 text-center gap-3 interactive-hover ${
                  selectedDept === dept
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-500/5'
                    : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${selectedDept === dept ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-950/40 text-slate-500'}`}>
                  <Calendar className="h-5.5 w-5.5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{dept}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider uppercase py-3 px-6 rounded-xl shadow-lg transition interactive-hover"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Doctor */}
      {step === 2 && (
        <div className="space-y-6 fade-in">
          <h3 className="text-sm font-bold tracking-widest text-slate-300 uppercase ml-1">Available Specialists: {selectedDept}</h3>
          
          {doctors.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/20 border border-white/5 rounded-2xl">
              <User className="h-10 w-10 text-slate-700 mx-auto mb-3 animate-pulse" />
              <p className="text-slate-300 font-semibold">No active specialists listed in {selectedDept}</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Please select a different department or contact administrator desk.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDoctorId(doc.id)}
                  className={`flex items-center p-4.5 rounded-2xl border text-left gap-4 transition duration-300 interactive-hover ${
                    selectedDoctorId === doc.id
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-md shadow-cyan-500/5'
                      : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="h-12 w-12 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-center text-cyan-400 font-black text-lg shadow-inner">
                    {doc.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{doc.name}</h4>
                    <p className="text-3xs text-slate-400 font-semibold mt-0.5">{doc.specialization || 'Clinical Specialist'}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-3xs text-emerald-400 font-bold uppercase tracking-wider">
                      <Star className="h-3 w-3 fill-emerald-400/20" /> Active Today
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-white/5">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-2 bg-slate-800/80 border border-white/5 hover:bg-slate-700 text-slate-300 font-bold text-xs tracking-wider uppercase py-3 px-5 rounded-xl transition interactive-hover"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleNextStep}
              disabled={doctors.length === 0}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider uppercase py-3 px-6 rounded-xl shadow-lg transition interactive-hover disabled:opacity-50"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Choose Date & Time Slot */}
      {step === 3 && (
        <div className="space-y-6 fade-in">
          <h3 className="text-sm font-bold tracking-widest text-slate-300 uppercase ml-1">Configure Visiting Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-2xs font-bold text-slate-400 uppercase tracking-widest ml-1">Choose Target Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition shadow-inner"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-2xs font-bold text-slate-400 uppercase tracking-widest ml-1">Available Workday Hours</label>
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left text-xs transition duration-300 interactive-hover ${
                      selectedSlot === slot
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                        : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span className="font-bold tracking-wide">{slot}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-white/5">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-2 bg-slate-800/80 border border-white/5 hover:bg-slate-700 text-slate-300 font-bold text-xs tracking-wider uppercase py-3 px-5 rounded-xl transition interactive-hover"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <button
              onClick={handleBooking}
              disabled={loading || !selectedDate || !selectedSlot}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase py-3 px-6 rounded-xl shadow-lg transition interactive-hover disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Submitting booking...
                </>
              ) : (
                'Book Appointment'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Success Screen */}
      {step === 4 && bookingSuccess && (
        <div className="text-center py-12 space-y-6 fade-in">
          <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-bounce">
            <Check className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black tracking-tight text-slate-100">Consultation visit Scheduled!</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Your appointment with <span className="text-cyan-400 font-bold">{doctors.find(d => d.id === selectedDoctorId)?.name}</span> has been confirmed.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-white/5 p-5 rounded-2xl max-w-sm mx-auto text-left space-y-2 text-xs text-slate-300 shadow-inner">
            <div className="flex justify-between border-b border-white/5 pb-1.5"><span className="font-semibold text-slate-400">Visiting Specialty:</span><span className="text-white font-bold">{selectedDept}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-1.5"><span className="font-semibold text-slate-400">Scheduled Date:</span><span className="text-white font-bold">{selectedDate}</span></div>
            <div className="flex justify-between"><span className="font-semibold text-slate-400">Time Frame Slot:</span><span className="text-white font-bold">{selectedSlot}</span></div>
          </div>

          <div className="pt-4">
            <button
              onClick={resetForm}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs tracking-wider uppercase py-3.5 px-8 rounded-xl shadow-lg transition duration-300 interactive-hover"
            >
              Book Another Visit
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
