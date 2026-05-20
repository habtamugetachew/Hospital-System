import React, { useState, useEffect } from 'react';
import { db, collection, query, where, onSnapshot, doc, updateDoc, addDoc, Timestamp } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout, { MotionCard3D } from '../components/DashboardLayout';
import { FlaskConical, ClipboardList, Package, Plus, Send, FlaskConicalOff, Activity } from 'lucide-react';
import PredictivePharmacy from '../components/PredictivePharmacy';

export default function LabPharmacyDashboard() {
  const [activeTab, setActiveTab] = useState('pharmacy'); // pharmacy, lab
  
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
  
  const [labRequests, setLabRequests] = useState([]);
  const [showResultForm, setShowResultForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [testResult, setTestResult] = useState('');

  const [showStockForm, setShowStockForm] = useState(false);
  const [medName, setMedName] = useState('');
  const [medStock, setMedStock] = useState('');
  const [medUnit, setMedUnit] = useState('Units');

  useEffect(() => {
    const qPresc = query(collection(db, 'prescriptions'), where('status', '==', 'pending_dispense'));
    const unsubscribePresc = onSnapshot(qPresc, (snapshot) => {
      const pending = [];
      snapshot.forEach((doc) => {
        pending.push({ id: doc.id, ...doc.data() });
      });
      setPrescriptions(pending);
    });

    const unsubscribeInv = onSnapshot(collection(db, 'inventory'), (snapshot) => {
      const invList = [];
      snapshot.forEach((doc) => {
        invList.push({ id: doc.id, ...doc.data() });
      });
      setInventory(invList);
    });

    const unsubscribeLabs = onSnapshot(collection(db, 'lab_requests'), (snapshot) => {
      const labs = [];
      snapshot.forEach((doc) => {
        labs.push({ id: doc.id, ...doc.data() });
      });
      setLabRequests(labs);
    });

    return () => {
      unsubscribePresc();
      unsubscribeInv();
      unsubscribeLabs();
    };
  }, []);

  const handleDispense = async (prescriptionId) => {
    try {
      await updateDoc(doc(db, 'prescriptions', prescriptionId), {
        status: 'dispensed',
        dispensedAt: new Date()
      });
      alert("Prescription items dispensed successfully!");
    } catch (err) {
      console.error("Error updating prescription: ", err);
      alert("Failed to dispense prescription: " + err.message);
    }
  };

  const handleOpenResults = (request) => {
    setSelectedRequest(request);
    setTestResult('');
    setShowResultForm(true);
  };

  const handleSubmitResult = async (e) => {
    e.preventDefault();
    if (!testResult.trim()) return alert("Please enter test results.");

    try {
      await updateDoc(doc(db, 'lab_requests', selectedRequest.id), {
        result: testResult,
        status: 'completed',
        completedAt: Timestamp.now()
      });
      alert("Lab diagnostic results uploaded successfully!");
      setShowResultForm(false);
    } catch (err) {
      console.error("Error submitting lab results: ", err);
      alert("Failed to submit result: " + err.message);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!medName || !medStock) return alert("Please fill in inventory stock details.");

    try {
      await addDoc(collection(db, 'inventory'), {
        name: medName,
        stock: parseInt(medStock, 10),
        unit: medUnit,
        category: 'Pharmacy Inventory',
        updatedAt: new Date()
      });
      alert("Inventory medicine added successfully!");
      setMedName('');
      setMedStock('');
      setShowStockForm(false);
    } catch (err) {
      console.error("Error adding inventory record: ", err);
    }
  };

  // Define sidebar links specific to lab and pharmacy desk
  const sidebarLinks = [
    { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Package },
    { id: 'telemetry', label: 'Telemetry', icon: Activity },
    { id: 'lab', label: 'Diagnostic Desk', icon: FlaskConical },
  ];

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarLinks={sidebarLinks}
      title="Lab & Pharmacy Desk"
      subtitle={activeTab === 'telemetry' ? 'AI-driven medication burn-rate forecasting & stock alerts.' : activeTab === 'pharmacy' ? 'Dispense medical prescriptions and manage stock levels.' : 'Complete laboratory diagnostic orders and test worksheets.'}
    >
      {/* Pharmacy Tab Panel */}
      {activeTab === 'pharmacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
          {/* Real-time Prescriptions Table */}
          <div className="lg:col-span-2 space-y-6 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white/70 backdrop-blur-md border border-[var(--glass-border)] p-6 rounded-[28px] shadow-sm">
            <h2 className="text-lg font-bold tracking-tight">Pending Prescriptions Directory</h2>
            
            {prescriptions.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/20 border border-[var(--glass-border)] rounded-2xl">
                <div className="mx-auto h-12 w-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 mb-4 animate-pulse">
                  <ClipboardList className="h-5.5 w-5.5" />
                </div>
                <p className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">No pending prescriptions</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  Electronic prescriptions dispatched by on-duty doctors will stream here instantly for clinical dispensing.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((presc) => (
                  <MotionCard3D key={presc.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                    <div className="space-y-1.5 flex-1 text-left">
                      <span className="text-3xs uppercase tracking-widest font-mono text-cyan-400 font-bold">Diagnosed: {presc.diagnosis}</span>
                      <h4 className="font-extrabold text-sm">{presc.patientName}</h4>
                      <div className="flex gap-2 flex-wrap pt-2">
                        {presc.medicines.map((med, idx) => (
                          <span key={idx} className="bg-slate-950/60 dark:bg-slate-950/60 light:bg-slate-100 text-3xs text-slate-300 dark:text-slate-300 light:text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--glass-border)]">
                            {med.name} — {med.dosage} ({med.duration})
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDispense(presc.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition duration-300 interactive-hover shadow-sm self-start md:self-center shrink-0"
                    >
                      Dispense Medicine
                    </button>
                  </MotionCard3D>
                ))}
              </div>
            )}
          </div>

          {/* Inventory Levels Card */}
          <div className="space-y-6 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white/70 backdrop-blur-md border border-[var(--glass-border)] p-6 rounded-[28px] shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Medicine Stocks</h2>
              <button 
                onClick={() => setShowStockForm(true)} 
                className="p-2 bg-[var(--input-bg)] border border-[var(--input-border)] hover:bg-slate-700 rounded-xl text-cyan-400 transition"
                title="Restock Inventory"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {showStockForm && (
              <form onSubmit={handleAddStock} className="bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-50 border border-[var(--glass-border)] p-4.5 rounded-2xl space-y-4 fade-in shadow-inner text-[var(--text-primary)]">
                <div className="space-y-1">
                  <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Medicine Name</label>
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Paracetamol"
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/60"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Stock Level</label>
                    <input
                      type="number"
                      value={medStock}
                      onChange={(e) => setMedStock(e.target.value)}
                      placeholder="500"
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/60"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Stock Unit</label>
                    <input
                      type="text"
                      value={medUnit}
                      onChange={(e) => setMedUnit(e.target.value)}
                      placeholder="Units/Bottles"
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/60"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowStockForm(false)}
                    className="bg-slate-850 text-3xs font-bold tracking-wider uppercase py-1.5 px-3 rounded-lg text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-500 text-3xs font-bold tracking-wider uppercase py-1.5 px-3 rounded-lg text-white"
                  >
                    Add Stock
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {inventory.map((item) => (
                <MotionCard3D key={item.id} className="p-3.5 flex items-center justify-between shadow-sm">
                  <div className="text-left">
                    <span className="text-xs font-bold">{item.name}</span>
                    <p className="text-3xs text-[var(--text-slate-muted)] font-semibold mt-0.5">{item.category}</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-md text-3xs font-bold border ${
                    item.stock < 150 
                      ? 'bg-rose-500/10 text-rose-400 dark:text-rose-400 light:text-rose-600 border-rose-500/20 shadow-[0_0_8px_rgba(239,68,68,0.15)]' 
                      : 'bg-slate-800 dark:bg-slate-800 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-600 border-slate-700/50'
                  }`}>
                    {item.stock} {item.unit || 'Units'}
                  </span>
                </MotionCard3D>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <PredictivePharmacy />
      )}

      {activeTab === 'lab' && (
        <div className="space-y-6 bg-slate-900/40 dark:bg-slate-900/40 light:bg-white/70 backdrop-blur-md border border-[var(--glass-border)] p-6 rounded-[28px] shadow-sm fade-in">
          <h2 className="text-lg font-bold tracking-tight">Diagnostic worksheet roster</h2>
          
          {labRequests.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/20 border border-[var(--glass-border)] rounded-2xl">
              <div className="mx-auto h-12 w-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600 mb-4 animate-pulse">
                <FlaskConicalOff className="h-5.5 w-5.5" />
              </div>
              <p className="font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700">No diagnostic test workloads listed</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Laboratory testing requests dispatched from clinical desks will appear here dynamically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--glass-border)] text-[var(--text-slate-muted)] font-bold uppercase tracking-wider text-xs">
                    <th className="py-4 px-4.5">Patient Details</th>
                    <th className="py-4 px-4.5">Diagnostic Request</th>
                    <th className="py-4 px-4.5">Ordering Doctor</th>
                    <th className="py-4 px-4.5">Process Status</th>
                    <th className="py-4 px-4.5 text-right">Laboratory Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                  {labRequests.map((lab) => (
                    <tr key={lab.id} className="hover:bg-white/2 dark:hover:bg-white/2 light:hover:bg-slate-100 transition duration-200">
                      <td className="py-4.5 px-4.5 font-bold">{lab.patientName}</td>
                      <td className="py-4.5 px-4.5 text-cyan-400 font-semibold">{lab.testType}</td>
                      <td className="py-4.5 px-4.5 font-medium">{lab.doctorName}</td>
                      <td className="py-4.5 px-4.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-3xs font-extrabold uppercase tracking-wider border ${
                          lab.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 dark:text-emerald-400 light:text-emerald-600 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                            : 'bg-amber-500/10 text-amber-400 dark:text-amber-400 light:text-amber-600 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${lab.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                          {lab.status}
                        </span>
                      </td>
                      <td className="py-4.5 px-4.5 text-right">
                        {lab.status !== 'completed' ? (
                          <button
                            onClick={() => handleOpenResults(lab)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-2xs py-2 px-4 rounded-xl transition duration-300 interactive-hover shadow-sm"
                          >
                            Upload Results
                          </button>
                        ) : (
                          <span className="text-3xs text-[var(--text-slate-muted)] font-extrabold tracking-wider uppercase">Results Filed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Upload Form Modal */}
          {showResultForm && selectedRequest && (
            <div className="fixed inset-0 bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
              <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] p-6 rounded-[28px] w-full max-w-md space-y-5 shadow-2xl relative text-[var(--text-primary)]">
                <h3 className="text-lg font-bold tracking-tight border-b border-[var(--glass-border)] pb-2">Record Diagnostic Outcome</h3>
                <div className="space-y-2 bg-[var(--input-bg)] border border-[var(--input-border)] p-4 rounded-2xl">
                  <div>
                    <p className="text-3xs text-[var(--text-slate-muted)] uppercase tracking-widest font-mono">Patient Profile</p>
                    <h4 className="font-bold text-sm mt-0.5">{selectedRequest.patientName}</h4>
                  </div>
                  <div>
                    <p className="text-3xs text-[var(--text-slate-muted)] uppercase tracking-widest font-mono">Required Test Type</p>
                    <span className="text-xs font-bold text-cyan-400 dark:text-cyan-400 light:text-cyan-600">{selectedRequest.testType}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmitResult} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-3xs font-bold text-[var(--text-slate-muted)] uppercase tracking-widest ml-1">Laboratory Diagnostic Report</label>
                    <textarea
                      value={testResult}
                      onChange={(e) => setTestResult(e.target.value)}
                      placeholder="File diagnostic details, metrics, blood counts, and pathology observations..."
                      rows={4}
                      className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-3.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-cyan-500/60"
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-[var(--glass-border)]">
                    <button
                      type="button"
                      onClick={() => setShowResultForm(false)}
                      className="bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200 text-3xs font-bold tracking-wider uppercase py-2 px-4 rounded-xl transition text-[var(--text-slate-muted)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-3xs font-bold tracking-wider uppercase py-2 px-4 rounded-xl transition shadow-sm text-white"
                    >
                      <Send className="h-3 w-3" /> Save Results
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
