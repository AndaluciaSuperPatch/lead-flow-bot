
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, SpotLight, useGLTF } from "@react-three/drei";

// Simple geometric avatars as placeholder: you can replace these models by proper imported GLB files when ready.

function FemaleSportyAvatar() {
  // For now, just use simple shapes to represent a sporty female (e.g. ponytail, athletic stance)
  return (
    <group position={[-1.2, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#e47b47" /> {/* Fair skin / redhead tone */}
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.11, 1.28, 0.28]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#28ff79" /> {/* Green eye */}
      </mesh>
      <mesh position={[0.11, 1.28, 0.28]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#28ff79" />
      </mesh>
      {/* Hair - simple ponytail back */}
      <mesh position={[0, 1.15, -0.19]} rotation={[-0.7, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.02, 0.40, 24]} />
        <meshStandardMaterial color="#c35f1a" /> {/* Red hair */}
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.17, 0.2, 0.65, 32]} />
        <meshStandardMaterial color="#42b4e6" /> {/* Sporty blue/teal top */}
      </mesh>
      {/* Leg L */}
      <mesh position={[-0.08, 0.25, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 18]} />
        <meshStandardMaterial color="#56423e" />
      </mesh>
      {/* Leg R */}
      <mesh position={[0.08, 0.25, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.5, 18]} />
        <meshStandardMaterial color="#56423e" />
      </mesh>
      {/* Arm L */}
      <mesh position={[-0.23, 0.83, 0]} rotation={[0, 0, 0.7]}>
        <cylinderGeometry args={[0.034, 0.032, 0.45, 14]} />
        <meshStandardMaterial color="#e47b47" />
      </mesh>
      {/* Arm R */}
      <mesh position={[0.23, 0.83, 0]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.034, 0.032, 0.45, 14]} />
        <meshStandardMaterial color="#e47b47" />
      </mesh>
    </group>
  );
}

function MaleFormalAvatar() {
  // Simple stylized businessman: suit, dark hair, blue eyes
  return (
    <group position={[1.2, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.22, 0]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial color="#85563a" /> {/* Brown skin */}
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.12, 1.29, 0.29]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#2e67ff" /> {/* Blue eye */}
      </mesh>
      <mesh position={[0.12, 1.29, 0.29]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#2e67ff" />
      </mesh>
      {/* Hair - simple dark */}
      <mesh position={[0, 1.34, 0]}>
        <sphereGeometry args={[0.34, 18, 18, 0, Math.PI]} />
        <meshStandardMaterial color="#1d1011" /> {/* Dark/black hair */}
      </mesh>
      {/* Body - suit */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.19, 0.21, 0.75, 32]} />
        <meshStandardMaterial color="#1a2630" /> {/* Navy suit */}
      </mesh>
      {/* Tie */}
      <mesh position={[0, 0.9, 0.17]}>
        <coneGeometry args={[0.037, 0.25, 16]} />
        <meshStandardMaterial color="#e63745" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.07, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.075, 0.57, 18]} />
        <meshStandardMaterial color="#2f3541" />
      </mesh>
      <mesh position={[0.07, 0.2, 0]}>
        <cylinderGeometry args={[0.08, 0.075, 0.57, 18]} />
        <meshStandardMaterial color="#2f3541" />
      </mesh>
      {/* Arm L */}
      <mesh position={[-0.24, 0.88, 0]} rotation={[0, 0, 0.88]}>
        <cylinderGeometry args={[0.04, 0.034, 0.47, 17]} />
        <meshStandardMaterial color="#1a2630" />
      </mesh>
      {/* Arm R */}
      <mesh position={[0.24, 0.88, 0]} rotation={[0, 0, -0.88]}>
        <cylinderGeometry args={[0.04, 0.034, 0.47, 17]} />
        <meshStandardMaterial color="#1a2630" />
      </mesh>
    </group>
  );
}

const BotAvatars3D = () => {
  return (
    <div className="w-full rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-1 my-6 shadow-lg" style={{height: "370px"}}>
      <Canvas camera={{ fov: 55, position: [0, 1.1, 5] }}>
        <ambientLight intensity={0.6} />
        <SpotLight position={[5, 10, 10]} angle={0.18} penumbra={0.4} intensity={1} />
        <FemaleSportyAvatar />
        <MaleFormalAvatar />
        <OrbitControls enablePan={false} minDistance={4} maxDistance={8} />
      </Canvas>
      <div className="flex justify-center gap-6 text-base font-semibold mt-2">
        <span>🤸‍♀️ Pelirroja deportista</span>
        <span>🤵🏻 Moreno formal</span>
      </div>
    </div>
  );
};

export default BotAvatars3D;
