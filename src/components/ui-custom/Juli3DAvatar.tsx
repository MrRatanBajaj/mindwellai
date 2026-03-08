import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Juli3DAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// ──────────── Head mesh ────────────
function Head({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const headRef = useRef<THREE.Group>(null!);
  const mouthRef = useRef<THREE.Mesh>(null!);
  const leftEyelidRef = useRef<THREE.Mesh>(null!);
  const rightEyelidRef = useRef<THREE.Mesh>(null!);
  const leftBrowRef = useRef<THREE.Mesh>(null!);
  const rightBrowRef = useRef<THREE.Mesh>(null!);
  const hairRef = useRef<THREE.Group>(null!);

  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#C68642'), 
    roughness: 0.55, 
    metalness: 0.05 
  }), []);

  const lipMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#C0616B'), 
    roughness: 0.4, 
    metalness: 0.0 
  }), []);

  const eyeWhiteMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#FAFAFA'), 
    roughness: 0.3 
  }), []);

  const irisMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#3B1F0B'), 
    roughness: 0.2, 
    metalness: 0.1 
  }), []);

  const pupilMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#0A0A0A'), 
    roughness: 0.1 
  }), []);

  const hairMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#1A0A00'), 
    roughness: 0.6, 
    metalness: 0.15 
  }), []);

  const eyelidMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#B07540'), 
    roughness: 0.5 
  }), []);

  const browMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#1A0A00'), 
    roughness: 0.7 
  }), []);

  const blushMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#D4847C'), 
    roughness: 0.7, 
    transparent: true, 
    opacity: 0.35 
  }), []);

  const noseMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: new THREE.Color('#B8733A'), 
    roughness: 0.5 
  }), []);

  // Track blink and breathing state
  const blinkTimer = useRef(0);
  const nextBlink = useRef(2 + Math.random() * 4);
  const isBlinking = useRef(false);
  const blinkProgress = useRef(0);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // ── Natural breathing head bob ──
    if (headRef.current) {
      const breathe = Math.sin(t * 0.8) * 0.015;
      headRef.current.position.y = breathe;
      // Subtle random head turn for lifelike feel
      const headTurnX = Math.sin(t * 0.3) * 0.04 + Math.sin(t * 0.7) * 0.02;
      const headTurnY = Math.sin(t * 0.2) * 0.06 + Math.cos(t * 0.5) * 0.03;
      headRef.current.rotation.x = headTurnX;
      headRef.current.rotation.y = headTurnY;

      if (isSpeaking) {
        // Extra subtle nod when speaking
        headRef.current.rotation.x += Math.sin(t * 2.5) * 0.03;
        headRef.current.rotation.z = Math.sin(t * 1.8) * 0.015;
      }
    }

    // ── Mouth animation ──
    if (mouthRef.current) {
      if (isSpeaking) {
        // Realistic mouth shapes cycling for speech
        const mouthOpen = 
          0.06 + 
          Math.abs(Math.sin(t * 6)) * 0.06 + 
          Math.abs(Math.sin(t * 9.3)) * 0.03 +
          Math.abs(Math.cos(t * 4.2)) * 0.02;
        const mouthWide = 
          0.14 + 
          Math.sin(t * 5) * 0.03 + 
          Math.sin(t * 7.5) * 0.015;
        mouthRef.current.scale.set(mouthWide / 0.14, mouthOpen / 0.04, 1);
      } else if (isListening) {
        // Slight smile when listening
        mouthRef.current.scale.set(1.05 + Math.sin(t * 1.2) * 0.05, 0.7, 1);
      } else {
        // Resting gentle smile
        const restSmile = 1 + Math.sin(t * 0.5) * 0.03;
        mouthRef.current.scale.set(restSmile, 0.8, 1);
      }
    }

    // ── Blinking ──
    blinkTimer.current += delta;
    if (!isBlinking.current && blinkTimer.current > nextBlink.current) {
      isBlinking.current = true;
      blinkProgress.current = 0;
      blinkTimer.current = 0;
      nextBlink.current = 2 + Math.random() * 5;
    }

    if (isBlinking.current) {
      blinkProgress.current += delta * 8;
      const blink = blinkProgress.current < 0.5 
        ? blinkProgress.current * 2 
        : 2 - blinkProgress.current * 2;
      const lidScale = Math.max(0.01, blink);

      if (leftEyelidRef.current) leftEyelidRef.current.scale.y = lidScale;
      if (rightEyelidRef.current) rightEyelidRef.current.scale.y = lidScale;

      if (blinkProgress.current >= 1) {
        isBlinking.current = false;
        if (leftEyelidRef.current) leftEyelidRef.current.scale.y = 0.01;
        if (rightEyelidRef.current) rightEyelidRef.current.scale.y = 0.01;
      }
    }

    // ── Eyebrow motion ──
    if (leftBrowRef.current && rightBrowRef.current) {
      const browLift = isSpeaking 
        ? Math.sin(t * 3) * 0.015 + 0.005
        : Math.sin(t * 0.8) * 0.005;
      leftBrowRef.current.position.y = 0.38 + browLift;
      rightBrowRef.current.position.y = 0.38 + browLift;
    }

    // ── Hair sway ──
    if (hairRef.current) {
      hairRef.current.rotation.z = Math.sin(t * 0.6) * 0.02;
    }
  });

  return (
    <group ref={headRef} position={[0, 0.1, 0]}>
      {/* Head sphere */}
      <mesh material={skinMat}>
        <sphereGeometry args={[0.55, 64, 64]} />
      </mesh>

      {/* Jaw area - slight extension */}
      <mesh position={[0, -0.2, 0.08]} material={skinMat}>
        <sphereGeometry args={[0.42, 32, 32]} />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.02, 0.5]} material={noseMat}>
        <sphereGeometry args={[0.06, 16, 16]} />
      </mesh>
      <mesh position={[0, -0.06, 0.48]} material={noseMat}>
        <sphereGeometry args={[0.04, 16, 16]} />
      </mesh>

      {/* === Eyes === */}
      {/* Left eye */}
      <group position={[-0.17, 0.12, 0.42]}>
        <mesh material={eyeWhiteMat}>
          <sphereGeometry args={[0.065, 32, 32]} />
        </mesh>
        <mesh position={[0, 0, 0.04]} material={irisMat}>
          <sphereGeometry args={[0.04, 24, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.06]} material={pupilMat}>
          <sphereGeometry args={[0.02, 16, 16]} />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.015, 0.015, 0.065]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        {/* Eyelid */}
        <mesh ref={leftEyelidRef} position={[0, 0.04, 0.02]} material={eyelidMat}>
          <boxGeometry args={[0.14, 0.06, 0.08]} />
        </mesh>
      </group>

      {/* Right eye */}
      <group position={[0.17, 0.12, 0.42]}>
        <mesh material={eyeWhiteMat}>
          <sphereGeometry args={[0.065, 32, 32]} />
        </mesh>
        <mesh position={[0, 0, 0.04]} material={irisMat}>
          <sphereGeometry args={[0.04, 24, 24]} />
        </mesh>
        <mesh position={[0, 0, 0.06]} material={pupilMat}>
          <sphereGeometry args={[0.02, 16, 16]} />
        </mesh>
        <mesh position={[0.015, 0.015, 0.065]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh ref={rightEyelidRef} position={[0, 0.04, 0.02]} material={eyelidMat}>
          <boxGeometry args={[0.14, 0.06, 0.08]} />
        </mesh>
      </group>

      {/* Eyebrows */}
      <mesh ref={leftBrowRef} position={[-0.17, 0.38, 0.4]} rotation={[0, 0, 0.15]} material={browMat}>
        <boxGeometry args={[0.12, 0.02, 0.03]} />
      </mesh>
      <mesh ref={rightBrowRef} position={[0.17, 0.38, 0.4]} rotation={[0, 0, -0.15]} material={browMat}>
        <boxGeometry args={[0.12, 0.02, 0.03]} />
      </mesh>

      {/* Blush cheeks */}
      <mesh position={[-0.3, -0.02, 0.35]} material={blushMat}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
      <mesh position={[0.3, -0.02, 0.35]} material={blushMat}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.18, 0.46]} material={lipMat}>
        <boxGeometry args={[0.14, 0.04, 0.04]} />
      </mesh>

      {/* === Hair === */}
      <group ref={hairRef}>
        {/* Top hair volume */}
        <mesh position={[0, 0.32, -0.05]} material={hairMat}>
          <sphereGeometry args={[0.52, 32, 32]} />
        </mesh>
        {/* Side hair - left */}
        <mesh position={[-0.45, -0.1, -0.05]} material={hairMat}>
          <capsuleGeometry args={[0.15, 0.6, 16, 16]} />
        </mesh>
        {/* Side hair - right */}
        <mesh position={[0.45, -0.1, -0.05]} material={hairMat}>
          <capsuleGeometry args={[0.15, 0.6, 16, 16]} />
        </mesh>
        {/* Back hair */}
        <mesh position={[0, -0.2, -0.3]} material={hairMat}>
          <capsuleGeometry args={[0.35, 0.7, 16, 16]} />
        </mesh>
        {/* Fringe / bangs */}
        <mesh position={[0, 0.35, 0.25]} rotation={[0.5, 0, 0]} material={hairMat}>
          <boxGeometry args={[0.7, 0.12, 0.25]} />
        </mesh>
      </group>

      {/* Ears */}
      <mesh position={[-0.52, 0.05, 0]} material={skinMat}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
      <mesh position={[0.52, 0.05, 0]} material={skinMat}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>

      {/* Small bindi (traditional Indian touch) */}
      <mesh position={[0, 0.25, 0.52]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial color="#CC1100" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, -0.55, 0]} material={skinMat}>
        <cylinderGeometry args={[0.15, 0.18, 0.25, 16]} />
      </mesh>

      {/* Upper shoulders hint */}
      <mesh position={[0, -0.72, -0.05]}>
        <boxGeometry args={[0.8, 0.15, 0.3]} />
        <meshStandardMaterial color="#9B7DD4" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ──────────── Scene ────────────
function Scene({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 5]} intensity={1.2} color="#FFF5E6" />
      <directionalLight position={[-3, 3, 2]} intensity={0.5} color="#E8D5FF" />
      <pointLight position={[0, 0, 3]} intensity={0.4} color="#FFE0D0" />
      <Head isSpeaking={isSpeaking} isListening={isListening} />
      <ContactShadows position={[0, -0.85, 0]} opacity={0.3} scale={3} blur={2} />
      <Environment preset="studio" />
    </>
  );
}

// ──────────── Main component ────────────
const Juli3DAvatar: React.FC<Juli3DAvatarProps> = ({
  isSpeaking = false,
  isListening = false,
  isActive = false,
  size = 'lg',
  className,
}) => {
  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Glow rings when active */}
      {isActive && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px solid hsl(var(--primary) / ${0.35 - i * 0.1})`,
              }}
              animate={{ scale: [1, 1.5 + i * 0.2], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
            />
          ))}
        </>
      )}

      {/* Speaking glow */}
      {isSpeaking && (
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)' }}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      {/* Listening glow */}
      {isListening && !isSpeaking && (
        <motion.div
          className="absolute -inset-3 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(142 76% 36% / 0.2), transparent 70%)' }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* 3D Canvas */}
      <div
        className={cn(
          sizeMap[size],
          'rounded-full overflow-hidden shadow-2xl',
          isActive && 'ring-4 ring-primary/25 ring-offset-4 ring-offset-background',
        )}
        style={{
          boxShadow: isSpeaking
            ? '0 0 80px hsl(var(--primary) / 0.4), 0 30px 60px -12px hsl(var(--primary) / 0.3)'
            : isActive
              ? '0 0 50px hsl(var(--primary) / 0.25)'
              : '0 20px 40px hsl(var(--primary) / 0.1)',
        }}
      >
        <Canvas
          camera={{ position: [0, 0.1, 1.8], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'linear-gradient(180deg, #F3E8FF 0%, #EDE9FE 50%, #DDD6FE 100%)' }}
        >
          <Scene isSpeaking={isSpeaking} isListening={isListening} />
        </Canvas>
      </div>

      {/* Status badge */}
      {isActive && (
        <motion.div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xl"
          style={{
            background: isSpeaking
              ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(280 76% 50%))'
              : isListening
                ? 'linear-gradient(135deg, hsl(142 76% 36%), hsl(160 76% 40%))'
                : 'linear-gradient(135deg, hsl(142 76% 36%), hsl(var(--primary)))',
          }}
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          {isSpeaking ? (
            <span className="flex items-center gap-2">
              <motion.div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white rounded-full"
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </motion.div>
              Speaking...
            </span>
          ) : isListening ? (
            <span className="flex items-center gap-1.5">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🎧</motion.span>
              Listening...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>💚</motion.span>
              Ready
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Juli3DAvatar;
