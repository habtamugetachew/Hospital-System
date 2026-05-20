import React from 'react';

export default function StaticHoloScanner() {
  return (
    <div className="w-full h-full min-h-[650px] relative rounded-2xl bg-slate-950/60 backdrop-blur-md border border-slate-800 p-6 overflow-hidden flex flex-col items-center justify-center shadow-xl">
      
      {/* Deep Space / Pitch-Black Gradient Background to blend the image seamlessly */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#040b16] to-[#020617] pointer-events-none z-0 opacity-80"></div>
      
      {/* Top Left Title & Subtitle */}
      <div className="absolute top-6 left-6 z-20">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest drop-shadow-md">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#22c55e] bg-green-500"></span>
          Holographic Anatomy Scan
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 font-medium tracking-wide">
          Interactive Diagnostics Mapping
        </p>
      </div>

      {/* Grid Overlay Lines simulating a high-tech scanner screen */}
      <div className="absolute inset-6 border border-slate-700/50 rounded-xl pointer-events-none z-10">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50 -translate-x-[1px] -translate-y-[1px]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 translate-x-[1px] -translate-y-[1px]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 -translate-x-[1px] translate-y-[1px]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50 translate-x-[1px] translate-y-[1px]"></div>
      </div>

      {/* Main Image Integration */}
      <div className="relative w-full h-[500px] z-10 flex items-center justify-center mt-8">
        <img 
          src="/static-skeleton.png" 
          alt="Anatomical Skeleton Hologram" 
          className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.2)] mix-blend-screen select-none"
          draggable="false"
        />
      </div>

      {/* Bottom Digital Telemetry Labels */}
      <div className="absolute bottom-8 left-8 z-20">
        <div className="text-[10px] text-cyan-500/80 font-mono tracking-widest">
          AXIAL VIEW: STABLE
        </div>
      </div>
      <div className="absolute bottom-8 right-8 z-20 text-right">
        <div className="text-[10px] text-cyan-400/60 font-mono tracking-widest">
          RESOLUTION: 4K ULTRA
        </div>
      </div>
      
    </div>
  );
}
