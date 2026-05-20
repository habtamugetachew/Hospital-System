import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, TrendingUp, Activity, PackageOpen } from 'lucide-react';

// Mock predictive inventory data
const MOCK_INVENTORY = [
  { id: 1, name: 'Amoxicillin 500mg', stock: 120, avgDailyUsage: 45, threshold: 100, trend: 'up' },
  { id: 2, name: 'Lisinopril 10mg', stock: 450, avgDailyUsage: 20, threshold: 150, trend: 'stable' },
  { id: 3, name: 'Atorvastatin 20mg', stock: 85, avgDailyUsage: 60, threshold: 150, trend: 'up' }, // Critical
  { id: 4, name: 'Metformin 500mg', stock: 210, avgDailyUsage: 80, threshold: 200, trend: 'up' }, // Warning
  { id: 5, name: 'Ibuprofen 400mg', stock: 800, avgDailyUsage: 50, threshold: 300, trend: 'stable' }
];

export default function PredictivePharmacy() {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [activeFilter, setActiveFilter] = useState('all');

  // Predictive logic calculation
  const getStatus = (item) => {
    const daysRemaining = item.stock / item.avgDailyUsage;
    if (daysRemaining <= 2 || item.stock < item.threshold * 0.6) return 'critical';
    if (daysRemaining <= 5 || item.stock < item.threshold) return 'warning';
    return 'healthy';
  };

  const filteredInventory = inventory.filter(item => {
    if (activeFilter === 'all') return true;
    return getStatus(item) === activeFilter;
  });

  return (
    <div className="space-y-6 fade-in">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-3xl border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-indigo-500"></div>
        
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" /> Telemetry & Predictive Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">AI-driven medication burn-rate forecasting & stock alerts.</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-[var(--glass-border)] shadow-inner">
          {['all', 'critical', 'warning', 'healthy'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeFilter === filter 
                  ? 'bg-slate-800 text-cyan-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Logic Chart List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filteredInventory.map((item, index) => {
            const status = getStatus(item);
            const daysRemaining = (item.stock / item.avgDailyUsage).toFixed(1);
            
            // Dynamic styling based on predictive status
            const statusStyles = {
              critical: 'border-rose-500/50 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.2)] z-10 relative overflow-hidden',
              warning: 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
              healthy: 'border-[var(--glass-border)] bg-slate-900/40 hover:bg-slate-900/60'
            };

            const textColors = {
              critical: 'text-rose-400',
              warning: 'text-amber-400',
              healthy: 'text-emerald-400'
            };

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 border ${statusStyles[status]}`}
              >
                {/* Critical Glow Effect */}
                {status === 'critical' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent animate-pulse pointer-events-none"></div>
                )}

                <div className="flex items-center gap-4 flex-1 w-full">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${
                    status === 'critical' ? 'bg-rose-950 border-rose-500/30 text-rose-500' :
                    status === 'warning' ? 'bg-amber-950 border-amber-500/30 text-amber-500' :
                    'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    <PackageOpen className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {item.name}
                      {status === 'critical' && <AlertTriangle className="h-4 w-4 text-rose-500 animate-bounce" />}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Current Stock: <span className="font-mono font-bold text-slate-200">{item.stock}</span> units
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-10 w-full md:w-auto relative z-10">
                  {/* Telemetry Stats */}
                  <div className="space-y-1">
                    <p className="text-3xs uppercase tracking-widest font-bold text-slate-500">Avg Burn Rate</p>
                    <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-slate-300">
                      {item.avgDailyUsage}/day
                      {item.trend === 'up' ? (
                        <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                      ) : item.trend === 'down' ? (
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-3xs uppercase tracking-widest font-bold text-slate-500">Est. Depletion</p>
                    <p className={`text-sm font-mono font-bold ${textColors[status]}`}>
                      {daysRemaining} Days
                    </p>
                  </div>

                  {/* Action Button */}
                  <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm ${
                    status === 'critical' ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50' :
                    status === 'warning' ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/50' :
                    'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}>
                    Restock Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredInventory.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-2xl border border-[var(--glass-border)]">
            <Activity className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="font-semibold">No inventory items match this status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
