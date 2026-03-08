import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { ContactShadows, useAnimations } from '@react-three/drei';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
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
   SOPHIA — Realistic 3D Counselor Avatar (FBX Model)
   With facial expression overlays, speaking aura & animations
   ══════════════════════════════════════════════════════════ */

function SophiaModel({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const fbx = useLoader(FBXLoader, '/models/sophia.fbx');
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (fbx) {
      // Scale & position the model
      fbx.scale.setScalar(0.012);
      fbx.position.set(0, -1.8, 0);
      fbx.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat: THREE.Material) => {
                (mat as THREE.MeshStandardMaterial).roughness = 0.5;
                (mat as THREE.MeshStandardMaterial).metalness = 0.05;
                (mat as THREE.MeshStandardMaterial).needsUpdate = true;
              });
            } else {
              (child.material as THREE.MeshStandardMaterial).roughness = 0.5;
              (child.material as THREE.MeshStandardMaterial).metalness = 0.05;
              child.material.needsUpdate = true;
            }
          }
        }
      });

      // Play built-in idle animation if available
      if (fbx.animations && fbx.animations.length > 0) {
        mixerRef.current = new THREE.AnimationMixer(fbx);
        const idleAction = mixerRef.current.clipAction(fbx.animations[0]);
        idleAction.play();
      }
    }
  }, [fbx]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (groupRef.current) {
      const t = state.clock.elapsedTime;

      // Speaking: head nod + subtle lean forward
      if (isSpeaking) {
        groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.04;
        groupRef.current.rotation.x = Math.sin(t * 1.5) * 0.015;
        groupRef.current.position.y = Math.sin(t * 1.2) * 0.01;
      } else if (isListening) {
        // Listening: gentle lean in
        groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.03;
        groupRef.current.rotation.x = 0.02 + Math.sin(t * 0.4) * 0.01;
        groupRef.current.position.y = 0;
      } else {
        // Idle: very subtle sway
        groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.02;
        groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.008;
        groupRef.current.position.y = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
}

// Speaking aura/glow effect around model
function SpeakingAura({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;

    if (isSpeaking) {
      meshRef.current.scale.setScalar(1.1 + Math.sin(t * 3) * 0.1);
      mat.opacity = 0.06 + Math.sin(t * 2) * 0.03;
      mat.color.setHSL(0.76, 0.7, 0.6); // purple
    } else if (isListening) {
      meshRef.current.scale.setScalar(1.0);
      mat.opacity = 0.03;
      mat.color.setHSL(0.4, 0.7, 0.5); // green
    } else {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.2, 0]}>
      <sphereGeometry args={[1.2, 24, 24]} />
      <meshBasicMaterial transparent opacity={0} side={THREE.BackSide} color="#7c3aed" />
    </mesh>
  );
}

// Loading fallback inside Canvas
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = state.clock.elapsedTime;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[0.3, 0.08, 12, 32]} />
      <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.3} />
    </mesh>
  );
}

function SophiaScene({ isSpeaking, isListening }: { isSpeaking: boolean; isListening: boolean }) {
  return (
    <>
      {/* Lighting setup for realistic skin rendering */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 5]} intensity={0.9} castShadow color="#fff5e6" />
      <directionalLight position={[-3, 3, 2]} intensity={0.4} color="#e6e0ff" />
      <pointLight position={[0, 2, 3]} intensity={0.4} color="#ffeedd" />
      {/* Rim light for depth */}
      <pointLight position={[0, 1.5, -3]} intensity={0.6} color="#a78bfa" />
      {/* Fill from below for face */}
      <pointLight position={[0, -1, 2]} intensity={0.2} color="#ffd4b8" />

      <Suspense fallback={<LoadingFallback />}>
        <SophiaModel isSpeaking={isSpeaking} isListening={isListening} />
      </Suspense>

      <SpeakingAura isSpeaking={isSpeaking} isListening={isListening} />
      <ContactShadows position={[0, -1.85, 0]} opacity={0.35} scale={3} blur={2.5} />
    </>
  );
}

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
        camera={{ position: [0, 0.2, 2.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <SophiaScene isSpeaking={isSpeaking} isListening={isListening} />
      </Canvas>

      {/* Status badge */}
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

export default Sophia3DAvatar;
