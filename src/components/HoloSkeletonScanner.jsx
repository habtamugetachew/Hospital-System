import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

// The 360 Cylinder Hologram Component
function HolographicCylinder() {
  const meshRef = useRef();
  
  // Load the highly detailed skeleton image
  const texture = useTexture('/holo-cylinder.png');

  // Continually spin the cylinder to create the 360 loop illusion
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      // Add a very subtle vertical float
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* 
        CylinderGeometry args: [radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded]
        We make it open-ended (true) so there are no caps on top or bottom.
      */}
      <cylinderGeometry args={[4, 4, 12, 64, 1, true]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        opacity={0.9}
        color="#ffffff"
      />
    </mesh>
  );
}

// Loading state while texture fetches
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest whitespace-nowrap">Calibrating 360° Scan...</p>
      </div>
    </Html>
  );
}

export default function HoloSkeletonScanner() {
  return (
    <div className="w-full h-full min-h-[600px] relative rounded-3xl bg-slate-950/50 backdrop-blur-md border border-slate-800 shadow-[0_0_30px_rgba(0,242,254,0.15)] overflow-hidden flex flex-col">
      
      {/* Deep dark edge blending gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] pointer-events-none z-0"></div>
      
      {/* Top Left Overlay Indicators */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h3 className="text-sm font-extrabold text-cyan-400 flex items-center gap-2 uppercase tracking-widest font-mono drop-shadow-[0_0_5px_rgba(0,242,254,0.8)]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f2fe]"></span>
          CORE SKELETAL SYSTEM: 360° ACTIVE
        </h3>
        <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide font-mono">DRAG TO INSPECT • SCROLL TO ZOOM</p>
      </div>

      {/* Bottom Right Overlays */}
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none text-right">
        <div className="text-[10px] text-cyan-500/80 font-mono tracking-[0.2em]">CYLINDER MESH MAPPING</div>
        <div className="text-xs text-cyan-400/60 font-mono mt-1">SYS.ROTATION // INFINITE</div>
      </div>

      {/* Three.js Canvas */}
      <div className="flex-1 w-full h-full relative z-10 cursor-move">
        <Canvas camera={{ position: [0, 0, 16], fov: 50 }}>
          <Suspense fallback={<Loader />}>
            <HolographicCylinder />
          </Suspense>
          {/* OrbitControls for manual dragging/zooming with physics-like momentum */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={25}
          />
        </Canvas>
      </div>
      
      {/* Glowing neon shadow around the canvas edge to simulate a volumetric projector */}
      <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_50px_rgba(0,242,254,0.1)]"></div>
    </div>
  );
}
