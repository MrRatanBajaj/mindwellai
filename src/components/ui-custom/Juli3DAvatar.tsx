import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface Juli3DAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/* ══════════════════════════════════════════════════════════
   FULL-BODY 3D INDIAN GIRL CHARACTER
   Procedurally built with proper face, mouth, eyes, hair
   ══════════════════════════════════════════════════════════ */

const skinColor = new THREE.Color('#c68642');
const skinColorLight = new THREE.Color('#d4956b');
const hairColor = new THREE.Color('#1a0a00');
const lipColor = new THREE.Color('#b44060');
const eyeWhite = new THREE.Color('#f5f0e8');
const irisColor = new THREE.Color('#3d2008');
const pupilColor = new THREE.Color('#0a0500');
const blushColor = new THREE.Color('#d4785a');
const dressColor = new THREE.Color('#6d28d9');
const dressAccent = new THREE.Color('#a78bfa');

// ── Head with face features ──
function Head({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const leftBrowRef = useRef<THREE.Mesh>(null);
  const rightBrowRef = useRef<THREE.Mesh>(null);
  const leftLidRef = useRef<THREE.Mesh>(null);
  const rightLidRef = useRef<THREE.Mesh>(null);

  const mouthShapes = useRef({ open: 0, wide: 0 });
  const blinkState = useRef({ timer: 0, blinking: false });
  const expressionState = useRef({ browLift: 0, smile: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // ── Head subtle movement ──
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.3) * 0.06 + (isSpeaking ? Math.sin(t * 1.2) * 0.04 : 0);
      headRef.current.rotation.x = Math.sin(t * 0.25) * 0.03 + (isListening ? 0.05 : 0);
      headRef.current.rotation.z = Math.sin(t * 0.2) * 0.02;
    }

    // ── Mouth animation ──
    if (mouthRef.current) {
      if (isSpeaking) {
        // Realistic mouth shapes cycling through vowels
        const speed = 8;
        const vowelCycle = Math.sin(t * speed) * 0.5 + 0.5;
        const consonantCycle = Math.sin(t * speed * 1.7) * 0.5 + 0.5;
        mouthShapes.current.open = THREE.MathUtils.lerp(mouthShapes.current.open, 0.15 + vowelCycle * 0.25, 0.3);
        mouthShapes.current.wide = THREE.MathUtils.lerp(mouthShapes.current.wide, 0.8 + consonantCycle * 0.4, 0.25);
      } else {
        // Gentle smile when idle
        mouthShapes.current.open = THREE.MathUtils.lerp(mouthShapes.current.open, 0.02, 0.1);
        mouthShapes.current.wide = THREE.MathUtils.lerp(mouthShapes.current.wide, 1.0, 0.1);
      }
      mouthRef.current.scale.y = mouthShapes.current.open + 0.04;
      mouthRef.current.scale.x = mouthShapes.current.wide;
    }

    // ── Natural eye blinking ──
    blinkState.current.timer += 0.016;
    if (!blinkState.current.blinking && blinkState.current.timer > 2.5 + Math.random() * 2) {
      blinkState.current.blinking = true;
      blinkState.current.timer = 0;
    }
    if (blinkState.current.blinking && blinkState.current.timer > 0.15) {
      blinkState.current.blinking = false;
      blinkState.current.timer = 0;
    }

    const lidScale = blinkState.current.blinking ? 1.0 : 0.0;
    if (leftLidRef.current) leftLidRef.current.scale.y = THREE.MathUtils.lerp(leftLidRef.current.scale.y, lidScale, 0.5);
    if (rightLidRef.current) rightLidRef.current.scale.y = THREE.MathUtils.lerp(rightLidRef.current.scale.y, lidScale, 0.5);

    // ── Eye look direction ──
    const lookX = Math.sin(t * 0.5) * 0.02;
    const lookY = Math.sin(t * 0.35) * 0.015;
    if (leftEyeRef.current) { leftEyeRef.current.position.x = -0.18 + lookX; leftEyeRef.current.position.y = 0.12 + lookY; }
    if (rightEyeRef.current) { rightEyeRef.current.position.x = 0.18 + lookX; rightEyeRef.current.position.y = 0.12 + lookY; }

    // ── Eyebrow expressions ──
    const browTarget = isSpeaking ? 0.02 + Math.sin(t * 2) * 0.01 : isListening ? 0.015 : 0;
    expressionState.current.browLift = THREE.MathUtils.lerp(expressionState.current.browLift, browTarget, 0.1);
    if (leftBrowRef.current) leftBrowRef.current.position.y = 0.28 + expressionState.current.browLift;
    if (rightBrowRef.current) rightBrowRef.current.position.y = 0.28 + expressionState.current.browLift;
  });

  return (
    <group ref={headRef} position={[0, 1.55, 0]}>
      {/* Head shape */}
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Face front — slightly lighter for depth */}
      <mesh position={[0, -0.02, 0.2]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color={skinColorLight} roughness={0.55} metalness={0.03} transparent opacity={0.6} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 0.0, 0.36]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color={skinColorLight} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.03, 0.35]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.5} />
      </mesh>

      {/* ── Eyes ── */}
      <group ref={leftEyeRef} position={[-0.18, 0.12, 0.3]}>
        {/* Eye socket shadow */}
        <mesh position={[0, 0, -0.02]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color={new THREE.Color('#8b6940')} roughness={0.8} />
        </mesh>
        {/* White */}
        <mesh>
          <sphereGeometry args={[0.065, 20, 20]} />
          <meshStandardMaterial color={eyeWhite} roughness={0.3} />
        </mesh>
        {/* Iris */}
        <mesh position={[0, 0, 0.04]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={irisColor} roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Pupil */}
        <mesh position={[0, 0, 0.055]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color={pupilColor} roughness={0.1} metalness={0.3} />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.015, 0.015, 0.065]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>
        {/* Eyelid */}
        <mesh ref={leftLidRef} position={[0, 0.03, 0.01]} scale={[1, 0, 1]}>
          <boxGeometry args={[0.14, 0.07, 0.06]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      <group ref={rightEyeRef} position={[0.18, 0.12, 0.3]}>
        <mesh position={[0, 0, -0.02]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color={new THREE.Color('#8b6940')} roughness={0.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.065, 20, 20]} />
          <meshStandardMaterial color={eyeWhite} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color={irisColor} roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.055]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color={pupilColor} roughness={0.1} metalness={0.3} />
        </mesh>
        <mesh position={[0.015, 0.015, 0.065]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.5} />
        </mesh>
        <mesh ref={rightLidRef} position={[0, 0.03, 0.01]} scale={[1, 0, 1]}>
          <boxGeometry args={[0.14, 0.07, 0.06]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>

      {/* ── Eyebrows ── */}
      <mesh ref={leftBrowRef} position={[-0.18, 0.28, 0.3]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.13, 0.02, 0.02]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      <mesh ref={rightBrowRef} position={[0.18, 0.28, 0.3]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.13, 0.02, 0.02]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>

      {/* ── Mouth / Lips ── */}
      <group position={[0, -0.1, 0.33]}>
        {/* Upper lip */}
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.12, 0.025, 0.04]} />
          <meshStandardMaterial color={lipColor} roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Lower lip — animated */}
        <mesh ref={mouthRef} position={[0, -0.015, 0]}>
          <boxGeometry args={[0.11, 0.03, 0.04]} />
          <meshStandardMaterial color={lipColor} roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Mouth interior (dark) */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color={new THREE.Color('#2a0510')} roughness={0.9} />
        </mesh>
      </group>

      {/* ── Cheek blush ── */}
      <mesh position={[-0.25, -0.02, 0.25]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={blushColor} transparent opacity={0.25} roughness={0.8} />
      </mesh>
      <mesh position={[0.25, -0.02, 0.25]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={blushColor} transparent opacity={0.25} roughness={0.8} />
      </mesh>

      {/* ── Ears ── */}
      <mesh position={[-0.37, 0.05, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.37, 0.05, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Earrings */}
      <mesh position={[-0.38, -0.02, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={new THREE.Color('#ffd700')} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.38, -0.02, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={new THREE.Color('#ffd700')} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ── Hair ── */}
      <Hair />

      {/* ── Bindi ── */}
      <mesh position={[0, 0.22, 0.37]}>
        <sphereGeometry args={[0.018, 10, 10]} />
        <meshStandardMaterial color={new THREE.Color('#dc2626')} emissive={new THREE.Color('#dc2626')} emissiveIntensity={0.3} roughness={0.2} />
      </mesh>
    </group>
  );
}

// ── Hair ──
function Hair() {
  return (
    <group>
      {/* Main hair volume */}
      <mesh position={[0, 0.12, -0.05]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>
      {/* Hair front bangs */}
      <mesh position={[0, 0.28, 0.22]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.2]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>
      {/* Side hair - left */}
      <mesh position={[-0.32, 0.0, 0.1]}>
        <boxGeometry args={[0.12, 0.5, 0.2]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>
      {/* Side hair - right */}
      <mesh position={[0.32, 0.0, 0.1]}>
        <boxGeometry args={[0.12, 0.5, 0.2]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>
      {/* Long hair back */}
      <mesh position={[0, -0.2, -0.2]}>
        <boxGeometry args={[0.55, 0.9, 0.15]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>
      {/* Hair bottom flow */}
      <mesh position={[0, -0.6, -0.18]}>
        <boxGeometry args={[0.45, 0.3, 0.12]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>
    </group>
  );
}

// ── Body (sitting at desk) ──
function Body({ isSpeaking }: { isSpeaking: boolean }) {
  const bodyRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Breathing
    if (bodyRef.current) {
      bodyRef.current.scale.x = 1 + Math.sin(t * 0.8) * 0.008;
      bodyRef.current.scale.z = 1 + Math.sin(t * 0.8) * 0.005;
    }

    // Hand/arm gestures while speaking
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = isSpeaking
        ? -0.3 + Math.sin(t * 1.5) * 0.15
        : -0.2 + Math.sin(t * 0.3) * 0.02;
      leftArmRef.current.rotation.z = isSpeaking
        ? 0.3 + Math.sin(t * 2) * 0.1
        : 0.25;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = isSpeaking
        ? -0.3 + Math.sin(t * 1.8 + 1) * 0.12
        : -0.2 + Math.sin(t * 0.3 + 0.5) * 0.02;
      rightArmRef.current.rotation.z = isSpeaking
        ? -0.3 + Math.sin(t * 2.2 + 1) * 0.08
        : -0.25;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Neck */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.15, 16]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      {/* Necklace */}
      <mesh position={[0, 1.22, 0.08]}>
        <torusGeometry args={[0.13, 0.008, 8, 24]} />
        <meshStandardMaterial color={new THREE.Color('#ffd700')} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Torso / Kurti top */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.55, 16]} />
        <meshStandardMaterial color={dressColor} roughness={0.7} />
      </mesh>
      {/* Dress details / dupatta drape */}
      <mesh position={[-0.15, 1.05, 0.15]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.35, 0.4, 0.03]} />
        <meshStandardMaterial color={dressAccent} roughness={0.8} transparent opacity={0.7} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.28, 1.15, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={dressColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.28, 1.15, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color={dressColor} roughness={0.7} />
      </mesh>

      {/* ── Arms ── */}
      <group ref={leftArmRef} position={[-0.32, 1.1, 0]}>
        <mesh position={[0, -0.18, 0.1]}>
          <cylinderGeometry args={[0.05, 0.04, 0.35, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.38, 0.15]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
        {/* Bangle */}
        <mesh position={[0, -0.28, 0.12]}>
          <torusGeometry args={[0.05, 0.006, 6, 16]} />
          <meshStandardMaterial color={new THREE.Color('#ffd700')} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.32, 1.1, 0]}>
        <mesh position={[0, -0.18, 0.1]}>
          <cylinderGeometry args={[0.05, 0.04, 0.35, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.38, 0.15]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.28, 0.12]}>
          <torusGeometry args={[0.05, 0.006, 6, 16]} />
          <meshStandardMaterial color={new THREE.Color('#ffd700')} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Lower body (seated) */}
      <mesh position={[0, 0.6, 0.05]}>
        <boxGeometry args={[0.5, 0.2, 0.35]} />
        <meshStandardMaterial color={dressColor} roughness={0.7} />
      </mesh>
    </group>
  );
}

// ── Desk / Table ──
function Desk() {
  return (
    <group position={[0, 0.35, 0.4]}>
      {/* Table top */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.05, 0.6]} />
        <meshStandardMaterial color={new THREE.Color('#5c3d2e')} roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Table edge trim */}
      <mesh position={[0, -0.025, 0.29]}>
        <boxGeometry args={[1.6, 0.04, 0.02]} />
        <meshStandardMaterial color={new THREE.Color('#4a2f21')} roughness={0.6} />
      </mesh>
      {/* Items on desk */}
      {/* Notepad */}
      <mesh position={[0.4, 0.04, 0.05]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.2, 0.015, 0.28]} />
        <meshStandardMaterial color={new THREE.Color('#f0e6d3')} roughness={0.9} />
      </mesh>
      {/* Pen */}
      <mesh position={[0.55, 0.04, 0.1]} rotation={[0, 0.8, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.18, 8]} />
        <meshStandardMaterial color={new THREE.Color('#1e3a5f')} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Small plant */}
      <mesh position={[-0.5, 0.08, -0.05]}>
        <cylinderGeometry args={[0.05, 0.04, 0.08, 10]} />
        <meshStandardMaterial color={new THREE.Color('#8b6040')} roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.14, -0.05]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color={new THREE.Color('#2d8f4e')} roughness={0.8} />
      </mesh>
    </group>
  );
}

// ── Speaking Aura Effect ──
function SpeakingAura({ isSpeaking }: { isSpeaking: boolean }) {
  const auraRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (auraRef.current) {
      const t = state.clock.elapsedTime;
      const targetScale = isSpeaking ? 1.2 + Math.sin(t * 3) * 0.15 : 0.8;
      const targetOpacity = isSpeaking ? 0.12 + Math.sin(t * 2) * 0.05 : 0.03;
      auraRef.current.scale.setScalar(THREE.MathUtils.lerp(auraRef.current.scale.x, targetScale, 0.1));
      (auraRef.current.material as THREE.MeshStandardMaterial).opacity = 
        THREE.MathUtils.lerp((auraRef.current.material as THREE.MeshStandardMaterial).opacity, targetOpacity, 0.1);
    }
  });

  return (
    <mesh ref={auraRef} position={[0, 1.2, 0]}>
      <sphereGeometry args={[0.8, 24, 24]} />
      <meshStandardMaterial color={new THREE.Color('#7c3aed')} transparent opacity={0.05} side={THREE.BackSide} />
    </mesh>
  );
}

// ── Scene Composition ──
function JuliScene({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 5]} intensity={0.8} castShadow color="#fff5e6" />
      <directionalLight position={[-3, 3, 2]} intensity={0.4} color="#e6e0ff" />
      <pointLight position={[0, 2, 3]} intensity={0.3} color="#ffeedd" />
      {/* Rim light */}
      <pointLight position={[0, 2, -2]} intensity={0.5} color="#a78bfa" />

      <group position={[0, -1.2, 0]}>
        <Float speed={0.5} rotationIntensity={0} floatIntensity={isSpeaking ? 0.05 : 0.02}>
          <Head isSpeaking={isSpeaking} isListening={isListening} />
          <Body isSpeaking={isSpeaking} />
        </Float>
        <Desk />
        <SpeakingAura isSpeaking={isSpeaking} />
      </group>

      <ContactShadows position={[0, -1.85, 0]} opacity={0.3} scale={3} blur={2} />
    </>
  );
}

// ── Main Component ──
const Juli3DAvatar: React.FC<Juli3DAvatarProps> = ({
  isSpeaking = false,
  isListening = false,
  isActive = false,
  size = 'lg',
  className,
}) => {
  const sizeMap = {
    sm: 'w-48 h-56',
    md: 'w-64 h-72',
    lg: 'w-80 h-[380px]',
    xl: 'w-[400px] h-[460px]',
  };

  return (
    <div className={cn('relative', sizeMap[size], className)}>
      <Canvas
        camera={{ position: [0, 0.3, 2.8], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <JuliScene isSpeaking={isSpeaking} isListening={isListening} />
      </Canvas>

      {/* Status indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
          <div
            className={cn(
              "px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xl",
              isSpeaking ? "bg-gradient-to-r from-primary to-purple-500" :
              isListening ? "bg-gradient-to-r from-emerald-500 to-green-500" :
              "bg-gradient-to-r from-emerald-500 to-primary"
            )}
          >
            {isSpeaking ? '🗣️ Speaking...' : isListening ? '🎧 Listening...' : '💚 Ready'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Juli3DAvatar;
