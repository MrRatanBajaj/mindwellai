import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface Sophia3DAvatarProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/* ══════════════════════════════════════════════════════════
   SOPHIA — Procedural 3D Indian Girl Counselor
   Lightweight, no external models, guaranteed WebGL compat
   Full face: eyes, mouth motion, blinks, expressions, hair
   Full body: sitting at desk, hand gestures, breathing
   ══════════════════════════════════════════════════════════ */

const skin = new THREE.Color('#c68642');
const skinLight = new THREE.Color('#d4956b');
const hair = new THREE.Color('#1a0a00');
const lip = new THREE.Color('#b44060');
const eyeW = new THREE.Color('#f5f0e8');
const iris = new THREE.Color('#3d2008');
const pupil = new THREE.Color('#0a0500');
const blush = new THREE.Color('#d4785a');
const dress = new THREE.Color('#6d28d9');
const dressAcc = new THREE.Color('#a78bfa');
const gold = new THREE.Color('#ffd700');
const deskCol = new THREE.Color('#5c3d2e');

// ═══════════ HEAD ═══════════
function Head({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const headRef = useRef<THREE.Group>(null);
  const mouthTopRef = useRef<THREE.Mesh>(null);
  const mouthBotRef = useRef<THREE.Mesh>(null);
  const mouthInsideRef = useRef<THREE.Mesh>(null);
  const leftLidRef = useRef<THREE.Mesh>(null);
  const rightLidRef = useRef<THREE.Mesh>(null);
  const leftBrowRef = useRef<THREE.Mesh>(null);
  const rightBrowRef = useRef<THREE.Mesh>(null);
  const leftEyeGrpRef = useRef<THREE.Group>(null);
  const rightEyeGrpRef = useRef<THREE.Group>(null);

  const blink = useRef({ timer: 0, active: false });

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.3) * 0.06 + (isSpeaking ? Math.sin(t * 1.2) * 0.05 : 0);
      headRef.current.rotation.x = Math.sin(t * 0.25) * 0.03 + (isListening ? 0.06 : 0) + (isSpeaking ? Math.sin(t * 1.8) * 0.02 : 0);
      headRef.current.rotation.z = Math.sin(t * 0.2) * 0.02;
    }

    // ── MOUTH ANIMATION (key realism feature) ──
    if (mouthBotRef.current && mouthTopRef.current && mouthInsideRef.current) {
      if (isSpeaking) {
        // Cycle through phoneme-like shapes
        const o1 = Math.sin(t * 8) * 0.5 + 0.5;       // vowel open
        const o2 = Math.sin(t * 13.6) * 0.5 + 0.5;     // consonant
        const o3 = Math.sin(t * 5.3) * 0.5 + 0.5;       // rhythm
        const openAmount = 0.03 + o1 * 0.12 + o2 * 0.06;
        const wideAmount = 0.85 + o3 * 0.3;

        mouthBotRef.current.position.y = -0.015 - openAmount * 0.5;
        mouthBotRef.current.scale.x = wideAmount;
        mouthTopRef.current.scale.x = wideAmount * 0.95;
        mouthTopRef.current.position.y = 0.015 + openAmount * 0.1;
        mouthInsideRef.current.scale.y = openAmount * 4;
        mouthInsideRef.current.scale.x = wideAmount * 0.7;
        mouthInsideRef.current.visible = openAmount > 0.04;
      } else {
        // Gentle smile
        mouthBotRef.current.position.y = THREE.MathUtils.lerp(mouthBotRef.current.position.y, -0.015, 0.1);
        mouthBotRef.current.scale.x = THREE.MathUtils.lerp(mouthBotRef.current.scale.x, 1.0, 0.1);
        mouthTopRef.current.scale.x = THREE.MathUtils.lerp(mouthTopRef.current.scale.x, 1.0, 0.1);
        mouthTopRef.current.position.y = THREE.MathUtils.lerp(mouthTopRef.current.position.y, 0.015, 0.1);
        mouthInsideRef.current.scale.y = THREE.MathUtils.lerp(mouthInsideRef.current.scale.y, 0.1, 0.1);
        mouthInsideRef.current.visible = false;
      }
    }

    // ── BLINKING ──
    blink.current.timer += 0.016;
    if (!blink.current.active && blink.current.timer > 2.5 + Math.random() * 2.5) {
      blink.current.active = true;
      blink.current.timer = 0;
    }
    if (blink.current.active && blink.current.timer > 0.12) {
      blink.current.active = false;
      blink.current.timer = 0;
    }
    const lidY = blink.current.active ? 1.0 : 0.0;
    if (leftLidRef.current) leftLidRef.current.scale.y = THREE.MathUtils.lerp(leftLidRef.current.scale.y, lidY, 0.5);
    if (rightLidRef.current) rightLidRef.current.scale.y = THREE.MathUtils.lerp(rightLidRef.current.scale.y, lidY, 0.5);

    // ── EYE LOOK ──
    const lx = Math.sin(t * 0.5) * 0.02;
    const ly = Math.sin(t * 0.35) * 0.015;
    if (leftEyeGrpRef.current) { leftEyeGrpRef.current.position.x = -0.18 + lx; leftEyeGrpRef.current.position.y = 0.12 + ly; }
    if (rightEyeGrpRef.current) { rightEyeGrpRef.current.position.x = 0.18 + lx; rightEyeGrpRef.current.position.y = 0.12 + ly; }

    // ── EYEBROWS ──
    const browLift = isSpeaking ? 0.025 + Math.sin(t * 2.5) * 0.012 : isListening ? 0.018 : 0;
    if (leftBrowRef.current) leftBrowRef.current.position.y = 0.28 + browLift;
    if (rightBrowRef.current) rightBrowRef.current.position.y = 0.28 + browLift;
  });

  const EyeGroup = ({ ref: eyeRef, xPos }: { ref: React.RefObject<THREE.Group | null>; xPos: number }) => (
    <group ref={eyeRef} position={[xPos, 0.12, 0.3]}>
      {/* Socket */}
      <mesh position={[0, 0, -0.02]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshStandardMaterial color="#8b6940" roughness={0.8} />
      </mesh>
      {/* White */}
      <mesh><sphereGeometry args={[0.065, 20, 20]} /><meshStandardMaterial color={eyeW} roughness={0.3} /></mesh>
      {/* Iris */}
      <mesh position={[0, 0, 0.04]}><sphereGeometry args={[0.04, 16, 16]} /><meshStandardMaterial color={iris} roughness={0.2} metalness={0.1} /></mesh>
      {/* Pupil */}
      <mesh position={[0, 0, 0.055]}><sphereGeometry args={[0.022, 12, 12]} /><meshStandardMaterial color={pupil} roughness={0.1} metalness={0.3} /></mesh>
      {/* Highlight */}
      <mesh position={[0.015, 0.015, 0.065]}><sphereGeometry args={[0.008, 8, 8]} /><meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.6} /></mesh>
    </group>
  );

  return (
    <group ref={headRef} position={[0, 1.55, 0]}>
      {/* Head */}
      <mesh><sphereGeometry args={[0.38, 32, 32]} /><meshStandardMaterial color={skin} roughness={0.55} /></mesh>
      {/* Face front highlight */}
      <mesh position={[0, -0.02, 0.2]}><sphereGeometry args={[0.25, 24, 24]} /><meshStandardMaterial color={skinLight} roughness={0.5} transparent opacity={0.5} /></mesh>

      {/* Nose */}
      <mesh position={[0, 0, 0.36]}><sphereGeometry args={[0.045, 16, 16]} /><meshStandardMaterial color={skinLight} roughness={0.5} /></mesh>
      <mesh position={[0, -0.03, 0.35]}><sphereGeometry args={[0.035, 12, 12]} /><meshStandardMaterial color={skin} roughness={0.5} /></mesh>

      {/* Eyes */}
      <EyeGroup ref={leftEyeGrpRef} xPos={-0.18} />
      <EyeGroup ref={rightEyeGrpRef} xPos={0.18} />

      {/* Eyelids */}
      <mesh ref={leftLidRef} position={[-0.18, 0.15, 0.31]} scale={[1, 0, 1]}>
        <boxGeometry args={[0.14, 0.07, 0.06]} /><meshStandardMaterial color={skin} />
      </mesh>
      <mesh ref={rightLidRef} position={[0.18, 0.15, 0.31]} scale={[1, 0, 1]}>
        <boxGeometry args={[0.14, 0.07, 0.06]} /><meshStandardMaterial color={skin} />
      </mesh>

      {/* Eyebrows */}
      <mesh ref={leftBrowRef} position={[-0.18, 0.28, 0.3]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[0.13, 0.022, 0.02]} /><meshStandardMaterial color={hair} roughness={0.9} />
      </mesh>
      <mesh ref={rightBrowRef} position={[0.18, 0.28, 0.3]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.13, 0.022, 0.02]} /><meshStandardMaterial color={hair} roughness={0.9} />
      </mesh>

      {/* ── Mouth ── */}
      <group position={[0, -0.1, 0.33]}>
        <mesh ref={mouthTopRef} position={[0, 0.015, 0]}>
          <boxGeometry args={[0.12, 0.025, 0.04]} /><meshStandardMaterial color={lip} roughness={0.3} metalness={0.05} />
        </mesh>
        <mesh ref={mouthBotRef} position={[0, -0.015, 0]}>
          <boxGeometry args={[0.11, 0.03, 0.04]} /><meshStandardMaterial color={lip} roughness={0.3} metalness={0.05} />
        </mesh>
        <mesh ref={mouthInsideRef} position={[0, 0, -0.01]} visible={false}>
          <boxGeometry args={[0.08, 0.03, 0.025]} /><meshStandardMaterial color="#2a0510" roughness={0.9} />
        </mesh>
        {/* Teeth hint */}
        <mesh position={[0, 0.005, 0.005]}>
          <boxGeometry args={[0.07, 0.01, 0.01]} /><meshStandardMaterial color="#f0e8e0" roughness={0.4} />
        </mesh>
      </group>

      {/* Cheeks blush */}
      <mesh position={[-0.25, -0.02, 0.25]}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color={blush} transparent opacity={0.25} /></mesh>
      <mesh position={[0.25, -0.02, 0.25]}><sphereGeometry args={[0.06, 12, 12]} /><meshStandardMaterial color={blush} transparent opacity={0.25} /></mesh>

      {/* Ears + Earrings */}
      <mesh position={[-0.37, 0.05, 0]}><sphereGeometry args={[0.06, 10, 10]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0.37, 0.05, 0]}><sphereGeometry args={[0.06, 10, 10]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[-0.38, -0.02, 0]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color={gold} metalness={0.9} roughness={0.1} /></mesh>
      <mesh position={[0.38, -0.02, 0]}><sphereGeometry args={[0.025, 8, 8]} /><meshStandardMaterial color={gold} metalness={0.9} roughness={0.1} /></mesh>

      {/* Bindi */}
      <mesh position={[0, 0.22, 0.37]}><sphereGeometry args={[0.018, 10, 10]} /><meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.3} roughness={0.2} /></mesh>

      {/* Hair */}
      <mesh position={[0, 0.12, -0.05]}><sphereGeometry args={[0.42, 24, 24]} /><meshStandardMaterial color={hair} roughness={0.85} /></mesh>
      <mesh position={[0, 0.28, 0.22]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.6, 0.08, 0.2]} /><meshStandardMaterial color={hair} roughness={0.85} /></mesh>
      <mesh position={[-0.32, 0.0, 0.1]}><boxGeometry args={[0.12, 0.5, 0.2]} /><meshStandardMaterial color={hair} roughness={0.85} /></mesh>
      <mesh position={[0.32, 0.0, 0.1]}><boxGeometry args={[0.12, 0.5, 0.2]} /><meshStandardMaterial color={hair} roughness={0.85} /></mesh>
      <mesh position={[0, -0.2, -0.2]}><boxGeometry args={[0.55, 0.9, 0.15]} /><meshStandardMaterial color={hair} roughness={0.85} /></mesh>
      <mesh position={[0, -0.6, -0.18]}><boxGeometry args={[0.45, 0.3, 0.12]} /><meshStandardMaterial color={hair} roughness={0.85} /></mesh>
    </group>
  );
}

// ═══════════ BODY ═══════════
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
    // Arm gestures
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = isSpeaking ? -0.3 + Math.sin(t * 1.5) * 0.15 : -0.2 + Math.sin(t * 0.3) * 0.02;
      leftArmRef.current.rotation.z = isSpeaking ? 0.3 + Math.sin(t * 2) * 0.1 : 0.25;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = isSpeaking ? -0.3 + Math.sin(t * 1.8 + 1) * 0.12 : -0.2 + Math.sin(t * 0.3 + 0.5) * 0.02;
      rightArmRef.current.rotation.z = isSpeaking ? -0.3 + Math.sin(t * 2.2 + 1) * 0.08 : -0.25;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Neck */}
      <mesh position={[0, 1.3, 0]}><cylinderGeometry args={[0.1, 0.12, 0.15, 16]} /><meshStandardMaterial color={skin} /></mesh>
      {/* Necklace */}
      <mesh position={[0, 1.22, 0.08]}><torusGeometry args={[0.13, 0.008, 8, 24]} /><meshStandardMaterial color={gold} metalness={0.9} roughness={0.1} /></mesh>

      {/* Torso / Kurti */}
      <mesh position={[0, 0.95, 0]}><cylinderGeometry args={[0.22, 0.28, 0.55, 16]} /><meshStandardMaterial color={dress} roughness={0.7} /></mesh>
      {/* Dupatta */}
      <mesh position={[-0.15, 1.05, 0.15]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.35, 0.4, 0.03]} /><meshStandardMaterial color={dressAcc} roughness={0.8} transparent opacity={0.7} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.28, 1.15, 0]}><sphereGeometry args={[0.08, 12, 12]} /><meshStandardMaterial color={dress} /></mesh>
      <mesh position={[0.28, 1.15, 0]}><sphereGeometry args={[0.08, 12, 12]} /><meshStandardMaterial color={dress} /></mesh>

      {/* Left arm */}
      <group ref={leftArmRef} position={[-0.32, 1.1, 0]}>
        <mesh position={[0, -0.18, 0.1]}><cylinderGeometry args={[0.05, 0.04, 0.35, 10]} /><meshStandardMaterial color={skin} /></mesh>
        <mesh position={[0, -0.38, 0.15]}><sphereGeometry args={[0.045, 10, 10]} /><meshStandardMaterial color={skin} /></mesh>
        <mesh position={[0, -0.28, 0.12]}><torusGeometry args={[0.05, 0.006, 6, 16]} /><meshStandardMaterial color={gold} metalness={0.9} roughness={0.1} /></mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.32, 1.1, 0]}>
        <mesh position={[0, -0.18, 0.1]}><cylinderGeometry args={[0.05, 0.04, 0.35, 10]} /><meshStandardMaterial color={skin} /></mesh>
        <mesh position={[0, -0.38, 0.15]}><sphereGeometry args={[0.045, 10, 10]} /><meshStandardMaterial color={skin} /></mesh>
        <mesh position={[0, -0.28, 0.12]}><torusGeometry args={[0.05, 0.006, 6, 16]} /><meshStandardMaterial color={gold} metalness={0.9} roughness={0.1} /></mesh>
      </group>

      {/* Seated lower body */}
      <mesh position={[0, 0.6, 0.05]}><boxGeometry args={[0.5, 0.2, 0.35]} /><meshStandardMaterial color={dress} roughness={0.7} /></mesh>
    </group>
  );
}

// ═══════════ DESK ═══════════
function Desk() {
  return (
    <group position={[0, 0.35, 0.4]}>
      <mesh><boxGeometry args={[1.6, 0.05, 0.6]} /><meshStandardMaterial color={deskCol} roughness={0.7} /></mesh>
      <mesh position={[0, -0.025, 0.29]}><boxGeometry args={[1.6, 0.04, 0.02]} /><meshStandardMaterial color="#4a2f21" roughness={0.6} /></mesh>
      {/* Notepad */}
      <mesh position={[0.4, 0.04, 0.05]} rotation={[0, 0.2, 0]}><boxGeometry args={[0.2, 0.015, 0.28]} /><meshStandardMaterial color="#f0e6d3" roughness={0.9} /></mesh>
      {/* Pen */}
      <mesh position={[0.55, 0.04, 0.1]} rotation={[0, 0.8, Math.PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.18, 8]} /><meshStandardMaterial color="#1e3a5f" roughness={0.3} /></mesh>
      {/* Plant */}
      <mesh position={[-0.5, 0.08, -0.05]}><cylinderGeometry args={[0.05, 0.04, 0.08, 10]} /><meshStandardMaterial color="#8b6040" roughness={0.8} /></mesh>
      <mesh position={[-0.5, 0.14, -0.05]}><sphereGeometry args={[0.06, 10, 10]} /><meshStandardMaterial color="#2d8f4e" roughness={0.8} /></mesh>
    </group>
  );
}

// ═══════════ SPEAKING AURA ═══════════
function Aura({ isSpeaking }: { isSpeaking: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const m = ref.current.material as THREE.MeshBasicMaterial;
    const target = isSpeaking ? 0.1 + Math.sin(t * 2) * 0.04 : 0.02;
    m.opacity = THREE.MathUtils.lerp(m.opacity, target, 0.1);
    ref.current.scale.setScalar(isSpeaking ? 1.15 + Math.sin(t * 3) * 0.1 : 1.0);
  });
  return (
    <mesh ref={ref} position={[0, 1.1, 0]}>
      <sphereGeometry args={[0.9, 20, 20]} />
      <meshBasicMaterial color="#7c3aed" transparent opacity={0.02} side={THREE.BackSide} />
    </mesh>
  );
}

// ═══════════ SCENE ═══════════
function SophiaScene({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 5]} intensity={0.8} castShadow color="#fff5e6" />
      <directionalLight position={[-3, 3, 2]} intensity={0.4} color="#e6e0ff" />
      <pointLight position={[0, 2, 3]} intensity={0.3} color="#ffeedd" />
      <pointLight position={[0, 2, -2]} intensity={0.5} color="#a78bfa" />
      <pointLight position={[0, -1, 2]} intensity={0.15} color="#ffd4b8" />

      <group position={[0, -1.2, 0]}>
        <Float speed={0.4} rotationIntensity={0} floatIntensity={isSpeaking ? 0.04 : 0.015}>
          <Head isSpeaking={isSpeaking} isListening={isListening} />
          <Body isSpeaking={isSpeaking} />
        </Float>
        <Desk />
        <Aura isSpeaking={isSpeaking} />
      </group>

      <ContactShadows position={[0, -1.85, 0]} opacity={0.3} scale={3} blur={2} />
    </>
  );
}

// ═══════════ MAIN COMPONENT ═══════════
const Sophia3DAvatar: React.FC<Sophia3DAvatarProps> = ({
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
        gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <SophiaScene isSpeaking={isSpeaking} isListening={isListening} />
      </Canvas>

      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-white text-xs font-bold shadow-xl",
            isSpeaking ? "bg-gradient-to-r from-primary to-purple-500" :
            isListening ? "bg-gradient-to-r from-emerald-500 to-green-500" :
            "bg-gradient-to-r from-emerald-500 to-primary"
          )}>
            {isSpeaking ? '🗣️ Speaking...' : isListening ? '🎧 Listening...' : '💚 Ready'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sophia3DAvatar;
