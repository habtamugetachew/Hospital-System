import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, BrainCircuit, ShieldAlert, Activity, HeartPulse } from 'lucide-react';

export default function AITriage() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    // Mock API call delay
    setTimeout(() => {
      // Mock logic based on keywords
      const text = input.toLowerCase();
      let suggestions = [];
      let department = 'General Practice';
      
      if (text.includes('chest') || text.includes('heart') || text.includes('pain') || text.includes('breath')) {
        suggestions = [
          { name: 'Cardiology', match: 85, color: 'text-rose-400' },
          { name: 'Pulmonology', match: 40, color: 'text-amber-400' }
        ];
        department = 'Cardiology';
      } else if (text.includes('head') || text.includes('dizzy') || text.includes('migraine')) {
        suggestions = [
          { name: 'Neurology', match: 75, color: 'text-purple-400' },
          { name: 'General Practice', match: 45, color: 'text-emerald-400' }
        ];
        department = 'Neurology';
      } else if (text.includes('stomach') || text.includes('nausea') || text.includes('digest')) {
        suggestions = [
          { name: 'Gastroenterology', match: 80, color: 'text-amber-400' }
        ];
        department = 'Gastroenterology';
      } else {
        suggestions = [
          { name: 'General Practice', match: 65, color: 'text-emerald-400' },
          { name: 'Internal Medicine', match: 35, color: 'text-cyan-400' }
        ];
      }

      setResult({
        department,
        suggestions,
        summary: `Based on your described symptoms, our AI triages a primary match with the ${department} department. Please proceed to book an appointment.`
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 border border-cyan-500/30 rounded-3xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.1)]">
        {/* Animated background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Symptom Checker AI <Sparkles className="h-4 w-4 text-cyan-400" />
            </h3>
            <p className="text-sm text-slate-400">Describe what you're feeling in detail. Our neural network will analyze your symptoms and recommend the correct clinical pathway.</p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="relative z-10">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., I've been experiencing severe chest pain and shortness of breath for the last 2 hours..."
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl p-5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-300 resize-none min-h-[120px]"
              disabled={isAnalyzing}
            />
            <button
              type="submit"
              disabled={isAnalyzing || !input.trim()}
              className="absolute bottom-4 right-4 bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl shadow-lg shadow-cyan-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isAnalyzing ? (
                <Activity className="h-5 w-5 animate-pulse" />
              ) : (
                <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-center p-8 border border-cyan-500/20 rounded-3xl bg-cyan-950/20"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-cyan-900 border-t-cyan-400 animate-spin"></div>
                <BrainCircuit className="h-6 w-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-cyan-400 font-mono text-sm uppercase tracking-widest animate-pulse">Running Neural Diagnostics...</p>
            </div>
          </motion.div>
        )}

        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="bg-slate-900/60 border border-[var(--glass-border)] rounded-3xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"></div>
            
            <div className="flex items-start gap-4 mb-6">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Analysis Complete</h4>
                <p className="text-sm text-slate-400 mt-1">{result.summary}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Predicted Department Matches</p>
              
              {result.suggestions.map((sugg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                  className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <HeartPulse className={`h-5 w-5 ${sugg.color}`} />
                    <span className="font-bold text-slate-200">{sugg.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sugg.match}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className={`h-full ${
                          sugg.match > 80 ? 'bg-rose-500' : sugg.match > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      ></motion.div>
                    </div>
                    <span className={`font-mono font-bold text-sm ${sugg.color}`}>{sugg.match}% Match</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => {/* Would trigger tab switch in parent */}}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm border border-white/10 flex items-center gap-2"
              >
                Proceed to Booking
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
