import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// --- PROPS ---
interface IslandProps {
  position: [number, number, number];
  biome: string;
}

interface BuildingProps {
  position: [number, number, number];
  type: 'hotel' | 'cottage';
  color: string;
}

interface VehicleProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

// --- COMPONENTS ---

export const Island: React.FC<IslandProps> = ({ position, biome = 'city' }) => {
  const color = useMemo(() => {
    switch (biome) {
      case 'beach': return '#fde047';
      case 'forest': return '#4ade80';
      case 'mountain': return '#cbd5e1';
      case 'city': return '#94a3b8';
      case 'countryside': return '#86efac';
      default: return '#e2e8f0';
    }
  }, [biome]);

  return (
    <group position={position}>
      {/* Base Ground */}
      <mesh receiveShadow castShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[4, 3.5, 1, 8]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Water/Aura Ring */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[4.5, 4, 0.2, 16]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

export const Building: React.FC<BuildingProps> = ({ position, type, color }) => {
  return (
    <group position={position}>
      {type === 'hotel' ? (
        // Hotel: Tall Block
        <mesh castShadow position={[0, 1.5, 0]}>
          <boxGeometry args={[1.5, 3, 1.5]} />
          <meshStandardMaterial color={color} flatShading />
        </mesh>
      ) : (
        // Cottage: Cube + Roof
        <group position={[0, 0.5, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
          <mesh castShadow position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.5, 1, 4]} />
            <meshStandardMaterial color="#ef4444" flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
};

// --- VEHICLES ---

export const Vehicle = React.forwardRef<THREE.Group, VehicleProps & { type?: 'car' | 'bus' | 'train' | 'flight' }>(({ position, rotation, color, type = 'car' }, ref) => {
  return (
    <group position={position} rotation={rotation} ref={ref}>
      {type === 'car' && (
        <>
          <mesh castShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.8, 0.4, 1.6]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[0, 0.7, -0.2]}>
            <boxGeometry args={[0.6, 0.4, 0.8]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0.4, 0.2, 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 8]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.4, 0.2, 0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 8]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[0.4, 0.2, -0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 8]} />
            <meshStandardMaterial color="black" />
          </mesh>
          <mesh position={[-0.4, 0.2, -0.5]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.2, 8]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </>
      )}

      {type === 'bus' && (
        <>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[1, 0.8, 2.5]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0.51, 0.8, 0]}>
            <boxGeometry args={[0.1, 0.4, 2]} />
            <meshStandardMaterial color="#bae6fd" />
          </mesh>
          <mesh position={[-0.51, 0.8, 0]}>
            <boxGeometry args={[0.1, 0.4, 2]} />
            <meshStandardMaterial color="#bae6fd" />
          </mesh>
        </>
      )}

      {type === 'train' && (
        <>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.9, 0.8, 3]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh castShadow position={[0, 0.6, -1.8]}>
            <boxGeometry args={[0.8, 0.7, 0.5]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </>
      )}

      {type === 'flight' && (
        <group scale={[0.8, 0.8, 0.8]}>
          {/* Fuselage */}
          <mesh castShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.35, 2.5, 8, 16]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.5} />
          </mesh>
          
          {/* Cockpit Window */}
          <mesh position={[0, 0.2, 0.8]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.3, 0.05, 0.4]} />
            <meshStandardMaterial color="#0ea5e9" roughness={0.1} metalness={0.9} />
          </mesh>

          {/* Main Wings */}
          <mesh castShadow position={[0, 0, 0.2]}>
            <boxGeometry args={[3.5, 0.1, 0.8]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
          </mesh>

          {/* Tail Vertical */}
          <mesh castShadow position={[0, 0.6, -1]} rotation={[Math.PI / 4, 0, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.6]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>

          {/* Tail Horizontal */}
          <mesh castShadow position={[0, 0.2, -1]}>
            <boxGeometry args={[1.2, 0.05, 0.4]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>

          {/* Engines */}
          <mesh position={[0.8, -0.2, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
          <mesh position={[-0.8, -0.2, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
        </group>
      )}
    </group>
  );
});

// --- MARKERS ---

export const StartMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 2, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
      <meshStandardMaterial color="#cbd5e1" />
    </mesh>
    <mesh position={[0, 3.5, 0.5]} rotation={[0, Math.PI/2, 0]}>
      <boxGeometry args={[1, 0.8, 0.1]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
    <Text position={[0, 4.5, 0]} fontSize={0.5} color="#22c55e">START</Text>
  </group>
);

export const EndMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#fbbf24" /> {/* Gold Chest */}
    </mesh>
    <mesh position={[0, 1, 0]} rotation={[0, Math.PI/4, 0]}>
       <octahedronGeometry args={[0.5]} />
       <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
    </mesh>
    <Text position={[0, 2, 0]} fontSize={0.5} color="#fbbf24">FINISH</Text>
  </group>
);

export const HistoryMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Pillar */}
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
    <mesh position={[0, 1.1, 0]}>
      <boxGeometry args={[0.5, 0.2, 0.5]} />
      <meshStandardMaterial color="#cbd5e1" />
    </mesh>
    {/* Scroll */}
    <mesh position={[0, 1.4, 0]} rotation={[Math.PI/4, 0, 0]}>
       <cylinderGeometry args={[0.1, 0.1, 0.6, 8]} />
       <meshStandardMaterial color="#fcd34d" />
    </mesh>
  </group>
);

export const FoodMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Burger Buns */}
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 8]} />
      <meshStandardMaterial color="#f59e0b" />
    </mesh>
    <mesh position={[0, 0.5, 0]}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshStandardMaterial color="#f59e0b" />
    </mesh>
    {/* Patty */}
    <mesh position={[0, 0.35, 0]}>
       <cylinderGeometry args={[0.32, 0.32, 0.1, 8]} />
       <meshStandardMaterial color="#78350f" />
    </mesh>
  </group>
);

export const CafeMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Cup */}
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.25, 0.2, 0.4, 8]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
    {/* Steam */}
    <mesh position={[0, 0.6, 0]}>
      <sphereGeometry args={[0.1, 4, 4]} />
      <meshStandardMaterial color="#cbd5e1" transparent opacity={0.6} />
    </mesh>
  </group>
);

// --- WEATHER EFFECTS ---

export const Sun: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const sunRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005; // Slow rotation
    }
  });

  return (
    <group position={position} ref={sunRef}>
      {/* Sun core */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>
      {/* Glow */}
      <mesh>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export const CloudGroup: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const cloudRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group position={position} ref={cloudRef}>
      <mesh position={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#f1f5f9" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

export const Rain: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const rainRef = useRef<THREE.Group>(null);
  const raindrops = useMemo(() => Array.from({ length: 15 }, (_, _i) => ({
    x: (Math.random() - 0.5) * 4,
    y: Math.random() * 2,
    z: (Math.random() - 0.5) * 4,
    speed: 0.5 + Math.random() * 0.5,
  })), []);

  useFrame(() => {
    if (rainRef.current) {
      rainRef.current.children.forEach((drop, i) => {
        drop.position.y -= raindrops[i].speed * 0.05;
        if (drop.position.y < -2) {
          drop.position.y = 2;
        }
      });
    }
  });

  return (
    <group position={position} ref={rainRef}>
      {raindrops.map((drop, i) => (
        <mesh key={i} position={[drop.x, drop.y, drop.z]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 4]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// --- ENHANCED POI MARKERS ---

export const TourismMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Camera body */}
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[0.4, 0.3, 0.2]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
    {/* Lens */}
    <mesh position={[0, 0.3, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
    {/* Flash */}
    <mesh position={[0.15, 0.45, 0]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
    </mesh>
  </group>
);

export const NatureMarker: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Tree trunk */}
    <mesh position={[0, 0.3, 0]}>
      <cylinderGeometry args={[0.1, 0.15, 0.6, 6]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
    {/* Foliage - 3 layers */}
    <mesh position={[0, 0.7, 0]}>
      <coneGeometry args={[0.4, 0.4, 6]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
    <mesh position={[0, 0.9, 0]}>
      <coneGeometry args={[0.35, 0.35, 6]} />
      <meshStandardMaterial color="#16a34a" />
    </mesh>
    <mesh position={[0, 1.05, 0]}>
      <coneGeometry args={[0.25, 0.3, 6]} />
      <meshStandardMaterial color="#15803d" />
    </mesh>
  </group>
);
