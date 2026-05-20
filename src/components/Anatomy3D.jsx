import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

function HologramPlane() {
  // Load the skeleton image you provided
  const texture = useTexture('/skeleton.png');
  return (
    <mesh position={[0, 0, 0]}>
      {/* 5 wide by 11 high is a good aspect ratio for a full body vertical image */}
      <planeGeometry args={[5.5, 12]} /> 
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={1}
      />
    </mesh>
  );
}

function ConnectionPoint({ position, name, onSelect }) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (hovered) {
      mesh.current.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.2);
    } else {
      mesh.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(name);
  };

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { e.stopPropagation(); setHover(false); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[0.12, 32, 32]} />
      <meshBasicMaterial 
        color={hovered ? '#ffffff' : '#38bdf8'} 
        transparent 
        opacity={0.9}
      />
      {/* Outer Pulse Glow */}
      <mesh scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial 
          color="#0ea5e9" 
          transparent 
          opacity={hovered ? 0.8 : 0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Holographic Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[3, 3, 3]}>
        <ringGeometry args={[0.1, 0.12, 32]} />
        <meshBasicMaterial 
          color="#38bdf8" 
          transparent 
          opacity={hovered ? 0.9 : 0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </mesh>
  );
}

function HumanoidHologram({ onPartClick }) {
  const group = useRef();

  // Gentle floating animation for the entire group
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 1.2) * 0.15;
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      <HologramPlane />
      
      {/* 
        Interactive Glowing Points 
        Positioned relative to the 5.5 x 12 plane. 
        Z-index is slightly forward (0.1) to sit on top of the image.
      */}
      <ConnectionPoint name="Skull/Neurology" position={[0, 4.6, 0.1]} onSelect={onPartClick} />
      <ConnectionPoint name="Cervical Spine/ENT" position={[0, 3.2, 0.1]} onSelect={onPartClick} />
      
      <ConnectionPoint name="Right Shoulder" position={[-1.3, 2.5, 0.1]} onSelect={onPartClick} />
      <ConnectionPoint name="Left Shoulder" position={[1.3, 2.5, 0.1]} onSelect={onPartClick} />
      
      <ConnectionPoint name="Thoracic Spine/Cardiology" position={[0, 1.4, 0.1]} onSelect={onPartClick} />
      <ConnectionPoint name="Lumbar/Gastroenterology" position={[0, -0.2, 0.1]} onSelect={onPartClick} />
      <ConnectionPoint name="Pelvis/Urology" position={[0, -1.2, 0.1]} onSelect={onPartClick} />
      
      <ConnectionPoint name="Right Knee/Orthopedics" position={[-0.7, -4.0, 0.1]} onSelect={onPartClick} />
      <ConnectionPoint name="Left Knee/Orthopedics" position={[0.7, -4.0, 0.1]} onSelect={onPartClick} />
    </group>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin"></div>
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest">Initializing Scan...</p>
      </div>
    </Html>
  );
}

export default function Anatomy3D({ onPartSelect }) {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-3xl overflow-hidden bg-slate-950/80 border border-[var(--glass-border)] shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center">
      {/* Dark blue textured background container maintained */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/40 via-[#020617] to-indigo-950/40 pointer-events-none"></div>
      
      {/* Exact UI text retained from Image 1 request */}
      <div className="absolute top-5 left-6 z-10 pointer-events-none">
        <h3 className="text-sm font-extrabold text-cyan-400 flex items-center gap-2 uppercase tracking-widest font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Holo-Skeletal Scan Active
        </h3>
        <p className="text-xs text-emerald-400 mt-1.5 font-medium shadow-sm drop-shadow-md">Select an organ system to auto-fill diagnostics.</p>
      </div>

      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <Suspense fallback={<Loader />}>
          <HumanoidHologram onPartClick={onPartSelect} />
        </Suspense>
        {/* Orbit controls restricted so the user can't accidentally pan away, but can tilt slightly to see the 3D depth of the nodes */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          minPolarAngle={Math.PI / 2 - 0.2}
          maxPolarAngle={Math.PI / 2 + 0.2}
          minAzimuthAngle={-0.2}
          maxAzimuthAngle={0.2}
        />
      </Canvas>
    </div>
  );
}
