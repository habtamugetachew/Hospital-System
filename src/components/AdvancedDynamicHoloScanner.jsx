import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Intricate Digital Wireframe Material (Electric Cyan/Neon Blue)
const HoloMaterial = new THREE.MeshBasicMaterial({
  color: '#00e5ff',
  wireframe: true,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// Subtle, tiny glowing cyan points for joints
const JointMaterial = new THREE.MeshBasicMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

// Helper for tapered limb bones
function TaperedBone({ position, rotation, length, topRadius, bottomRadius }) {
  return (
    <mesh position={position} rotation={rotation} material={HoloMaterial}>
      <cylinderGeometry args={[topRadius, bottomRadius, length, 12, 4]} />
    </mesh>
  );
}

function AnatomicalSkeleton() {
  const group = useRef();

  // 1. Organically Curved Rib Cage (Volumetric Egg-Shape)
  const ribs = Array.from({ length: 12 }).map((_, i) => {
    const progress = i / 11; 
    // Tapers at top, expands near base, tapers slightly at very bottom
    const radius = Math.sin(progress * Math.PI) * 0.7 + 0.35; 
    // Anatomical downward curve that increases lower in the chest
    const downwardAngle = 0.1 + (progress * 0.4);
    
    return (
      <mesh 
        key={`rib-${i}`} 
        position={[0, 1.2 - i * 0.16, -0.05 + progress * 0.15]} 
        rotation={[Math.PI / 2 + downwardAngle, 0, 0]} 
        material={HoloMaterial}
      >
        {/* Flat tube simulating real ribs */}
        <torusGeometry args={[radius, 0.02, 6, 48]} />
      </mesh>
    );
  });

  // 2. Realistic S-Curved Spine
  const spine = Array.from({ length: 22 }).map((_, i) => {
    const progress = i / 21;
    // Mathematical S-curve (cervical lordosis, thoracic kyphosis, lumbar lordosis)
    const zOffset = Math.sin(progress * Math.PI * 2) * 0.12 - 0.15;
    const xRot = -Math.cos(progress * Math.PI * 2) * 0.15;
    
    return (
      <mesh key={`vert-${i}`} position={[0, 1.4 - i * 0.12, zOffset]} rotation={[xRot, 0, 0]} material={HoloMaterial}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 10]} />
      </mesh>
    );
  });

  // Coordinates for tiny node joints
  const joints = [
    [-1.25, 1.3, 0.05], [1.25, 1.3, 0.05], // Shoulders
    [-1.4, -0.1, 0.15], [1.4, -0.1, 0.15], // Elbows
    [-1.5, -1.4, 0.25], [1.5, -1.4, 0.25], // Wrists
    [-0.6, -1.2, 0], [0.6, -1.2, 0],       // Hips
    [-0.65, -3.4, 0.05], [0.65, -3.4, 0.05], // Knees
    [-0.65, -5.4, 0.05], [0.65, -5.4, 0.05]  // Ankles
  ];

  return (
    <group ref={group}>
      {/* --- THE SKULL --- */}
      {/* Cranium (Elongated oval sphere) */}
      <mesh position={[0, 2.4, 0.05]} material={HoloMaterial} scale={[1, 1.15, 1.2]}>
        <sphereGeometry args={[0.38, 24, 24]} />
      </mesh>
      {/* Jaw / Mandible (Tapered geometry) */}
      <mesh position={[0, 2.05, 0.18]} rotation={[0.15, 0, 0]} material={HoloMaterial}>
        <cylinderGeometry args={[0.3, 0.18, 0.4, 5]} />
      </mesh>
      {/* Cheekbones */}
      <mesh position={[-0.22, 2.15, 0.35]} rotation={[0, 0, 0.5]} material={HoloMaterial}><sphereGeometry args={[0.1, 8, 8]}/></mesh>
      <mesh position={[0.22, 2.15, 0.35]} rotation={[0, 0, -0.5]} material={HoloMaterial}><sphereGeometry args={[0.1, 8, 8]}/></mesh>

      {/* --- RIB CAGE & STERNUM --- */}
      {ribs}
      <mesh position={[0, 0.5, 0.5]} rotation={[-0.15, 0, 0]} material={HoloMaterial}>
        <cylinderGeometry args={[0.06, 0.02, 1.1, 6]} />
      </mesh>

      {/* --- SPINE --- */}
      {spine}

      {/* --- THE PELVIS --- */}
      {/* Beautifully sculpted butterfly-wing shape using overlapping angled toruses */}
      <mesh position={[-0.45, -0.85, -0.05]} rotation={[0.4, 0.5, -0.2]} scale={[1, 1.4, 0.15]} material={HoloMaterial}>
        <torusGeometry args={[0.45, 0.1, 12, 32]} />
      </mesh>
      <mesh position={[0.45, -0.85, -0.05]} rotation={[0.4, -0.5, 0.2]} scale={[1, 1.4, 0.15]} material={HoloMaterial}>
        <torusGeometry args={[0.45, 0.1, 12, 32]} />
      </mesh>
      {/* Sacrum (Tailbone) */}
      <mesh position={[0, -1.2, -0.2]} rotation={[0.3, 0, 0]} material={HoloMaterial}>
        <cylinderGeometry args={[0.15, 0.02, 0.5, 6]} />
      </mesh>

      {/* --- LIMBS & BONES --- */}
      {/* Clavicles */}
      <TaperedBone position={[-0.6, 1.35, 0.1]} rotation={[0, 0, Math.PI / 2 + 0.1]} length={1.2} topRadius={0.02} bottomRadius={0.04} />
      <TaperedBone position={[0.6, 1.35, 0.1]} rotation={[0, 0, Math.PI / 2 - 0.1]} length={1.2} topRadius={0.02} bottomRadius={0.04} />

      {/* Arms (Humerus) */}
      <TaperedBone position={[-1.35, 0.6, 0.1]} rotation={[0, 0, -0.1]} length={1.4} topRadius={0.06} bottomRadius={0.03} />
      <TaperedBone position={[1.35, 0.6, 0.1]} rotation={[0, 0, 0.1]} length={1.4} topRadius={0.06} bottomRadius={0.03} />

      {/* Forearms (Radius/Ulna) */}
      <TaperedBone position={[-1.45, -0.75, 0.2]} rotation={[-0.05, 0, -0.05]} length={1.3} topRadius={0.03} bottomRadius={0.04} />
      <TaperedBone position={[1.45, -0.75, 0.2]} rotation={[-0.05, 0, 0.05]} length={1.3} topRadius={0.03} bottomRadius={0.04} />

      {/* Hands */}
      <mesh position={[-1.5, -1.7, 0.25]} rotation={[0, 0, -0.05]} material={HoloMaterial}><boxGeometry args={[0.1, 0.35, 0.04]} /></mesh>
      <mesh position={[1.5, -1.7, 0.25]} rotation={[0, 0, 0.05]} material={HoloMaterial}><boxGeometry args={[0.1, 0.35, 0.04]} /></mesh>

      {/* Legs (Femur) */}
      <TaperedBone position={[-0.65, -2.3, 0.05]} rotation={[0, 0, -0.05]} length={2.2} topRadius={0.11} bottomRadius={0.05} />
      <TaperedBone position={[0.65, -2.3, 0.05]} rotation={[0, 0, 0.05]} length={2.2} topRadius={0.11} bottomRadius={0.05} />

      {/* Lower Legs (Tibia/Fibula) */}
      <TaperedBone position={[-0.65, -4.4, 0.05]} rotation={[0.02, 0, 0]} length={2.0} topRadius={0.07} bottomRadius={0.03} />
      <TaperedBone position={[0.65, -4.4, 0.05]} rotation={[0.02, 0, 0]} length={2.0} topRadius={0.07} bottomRadius={0.03} />

      {/* Feet */}
      <mesh position={[-0.65, -5.5, 0.2]} material={HoloMaterial}><boxGeometry args={[0.12, 0.1, 0.45]} /></mesh>
      <mesh position={[0.65, -5.5, 0.2]} material={HoloMaterial}><boxGeometry args={[0.12, 0.1, 0.45]} /></mesh>

      {/* --- ELEGANT NODE JOINTS --- */}
      {joints.map((pos, idx) => (
        <mesh key={`joint-node-${idx}`} position={pos} material={JointMaterial}>
          <sphereGeometry args={[0.035, 12, 12]} />
        </mesh>
      ))}
    </group>
  );
}

// Seamless Continuous 360 Rotation Wrapper
function HolographicScene() {
  const sceneRef = useRef();

  useFrame((state, delta) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += delta * 0.3; // Endless Y-Axis spin
      sceneRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1; // Float effect
    }
  });

  return (
    <group ref={sceneRef} position={[0, 1.5, 0]}>
      <AnatomicalSkeleton />
    </group>
  );
}

export default function AdvancedDynamicHoloScanner() {
  return (
    <div className="w-full h-full min-h-[650px] relative rounded-3xl bg-slate-950/50 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_40px_rgba(0,242,254,0.15)] overflow-hidden flex flex-col">
      
      {/* Deep Space / Pitch-Black Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#040b16] to-[#020617] pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay z-0"></div>
      
      {/* HUD Overlay Indicators */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h3 className="text-sm font-extrabold text-[#00e5ff] flex items-center gap-2 uppercase tracking-widest font-mono drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_10px_#00e5ff]"></span>
          ANATOMICAL MESH ACTIVE
        </h3>
        <p className="text-xs text-emerald-400 mt-2 font-medium tracking-wide font-mono">HIGH-FIDELITY PROCEDURAL BONE DATA</p>
      </div>

      <div className="absolute bottom-6 right-6 z-20 pointer-events-none text-right">
        <div className="text-[10px] text-cyan-500/80 font-mono tracking-[0.2em]">360° SPATIAL ORBIT VIEWER</div>
        <div className="text-xs text-[#00e5ff]/60 font-mono mt-1">SYS.RENDER // WIREFRAME_TRUE</div>
      </div>

      {/* Pure 3D Canvas */}
      <div className="flex-1 w-full h-full relative z-10 cursor-move">
        <Canvas camera={{ position: [0, 0, 12], fov: 65 }}>
          <HolographicScene />
          {/* OrbitControls enables full inspection without breaking the model */}
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.04}
            minDistance={4}
            maxDistance={20}
          />
        </Canvas>
      </div>
      
      {/* Cinematic Sci-Fi Scanlines */}
      <style>{`
        .hologram-scanlines {
          background: linear-gradient(to bottom, transparent 50%, rgba(0, 229, 255, 0.05) 51%);
          background-size: 100% 4px;
          animation: scanlineScroll 8s linear infinite;
          pointer-events: none;
        }
        @keyframes scanlineScroll {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
      `}</style>
      <div className="absolute inset-0 z-20 hologram-scanlines mix-blend-screen"></div>
    </div>
  );
}
