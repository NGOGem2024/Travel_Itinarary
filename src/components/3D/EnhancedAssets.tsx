import React from 'react';
import { Text } from '@react-three/drei';

interface SignboardProps {
  position: [number, number, number];
  text: string;
  subtext?: string;
}

export const Signboard: React.FC<SignboardProps> = ({ position, text, subtext }) => (
  <group position={position}>
    {/* Post - Taller */}
    <mesh position={[0, 2, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
    {/* Sign board - Even larger */}
    <mesh position={[0, 4.5, 0]} rotation={[0, 0, 0]}>
      <boxGeometry args={[6, 2, 0.2]} />
      <meshStandardMaterial color="#1e293b" />
    </mesh>
    {/* Border */}
    <mesh position={[0, 4.5, 0.11]} rotation={[0, 0, 0]}>
      <boxGeometry args={[5.8, 1.8, 0.05]} />
      <meshStandardMaterial color="#fbbf24" />
    </mesh>
    {/* Text - Large white text */}
    <Text
      position={[0, 4.8, 0.16]}
      rotation={[0, 0, 0]}
      fontSize={0.7}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      maxWidth={5.5}
    >
      {text}
    </Text>
    {subtext && (
      <Text
        position={[0, 4.2, 0.16]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={5.5}
      >
        {subtext}
      </Text>
    )}
  </group>
);

export const Tree: React.FC<{ position: [number, number, number]; variant?: 1 | 2 | 3 }> = ({ position, variant = 1 }) => {
  const colors = {
    1: { trunk: '#78350f', foliage: ['#22c55e', '#16a34a', '#15803d'] },
    2: { trunk: '#92400e', foliage: ['#4ade80', '#22c55e', '#16a34a'] },
    3: { trunk: '#713f12', foliage: ['#86efac', '#4ade80', '#22c55e'] },
  };

  const { trunk, foliage } = colors[variant];

  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1, 6]} />
        <meshStandardMaterial color={trunk} />
      </mesh>
      {/* Foliage - 3 layers */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.6, 0.6, 6]} />
        <meshStandardMaterial color={foliage[0]} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.5, 0.5, 6]} />
        <meshStandardMaterial color={foliage[1]} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <coneGeometry args={[0.35, 0.4, 6]} />
        <meshStandardMaterial color={foliage[2]} />
      </mesh>
    </group>
  );
};

export const Rock: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh rotation={[0.2, 0.3, 0.1]}>
      <dodecahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#94a3b8" flatShading />
    </mesh>
  </group>
);

export const Bush: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[-0.1, 0.15, 0]}>
      <sphereGeometry args={[0.2, 6, 6]} />
      <meshStandardMaterial color="#22c55e" flatShading />
    </mesh>
    <mesh position={[0.1, 0.15, 0.1]}>
      <sphereGeometry args={[0.18, 6, 6]} />
      <meshStandardMaterial color="#16a34a" flatShading />
    </mesh>
    <mesh position={[0, 0.2, -0.1]}>
      <sphereGeometry args={[0.15, 6, 6]} />
      <meshStandardMaterial color="#15803d" flatShading />
    </mesh>
  </group>
);

export const Airport: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Runway */}
    <mesh receiveShadow position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 6]} />
      <meshStandardMaterial color="#334155" />
    </mesh>
    {/* Runway Markings */}
    <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.1, 5]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
    
    {/* Terminal Building */}
    <mesh castShadow position={[-1.2, 0.5, 0]}>
      <boxGeometry args={[1, 1, 3]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
    <mesh position={[-1.2, 0.5, 0.5]}>
      <boxGeometry args={[1.1, 0.8, 0.5]} />
      <meshStandardMaterial color="#94a3b8" transparent opacity={0.6} />
    </mesh>

    {/* Control Tower */}
    <group position={[-1.2, 0, -1.2]}>
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.5, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.7} />
      </mesh>
    </group>
  </group>
);

export const BackgroundScenery: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const items = React.useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 100, // Wide spread X
        Math.random() * 10 - 2,      // Varying height Y
        (Math.random() - 0.5) * 100 - 20 // Deep background Z
      ] as [number, number, number],
      scale: Math.random() * 2 + 1,
      type: Math.random() > 0.5 ? 'cloud' : 'mountain',
      color: Math.random() > 0.5 ? '#f1f5f9' : '#94a3b8'
    }));
  }, [count]);

  return (
    <group>
      {items.map((item, i) => (
        <group key={i} position={item.position} scale={[item.scale, item.scale, item.scale]}>
          {item.type === 'cloud' ? (
            <mesh>
              <sphereGeometry args={[1, 8, 8]} />
              <meshStandardMaterial color={item.color} transparent opacity={0.4} />
            </mesh>
          ) : (
            <mesh rotation={[0, Math.random() * Math.PI, 0]}>
              <coneGeometry args={[2, 3, 4]} />
              <meshStandardMaterial color="#64748b" flatShading />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};
