import React, { useMemo, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Sphere, OrbitControls, Line, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { FaHotel, FaCoins, FaLandmark, FaUtensils, FaCoffee, FaTree } from 'react-icons/fa';
import { Vehicle } from './Assets';

interface Location {
  lat: number;
  lng: number;
  name: string;
  day?: number;
  activities?: string[];
  stay?: string;
  food?: string[];
  weather?: string;
  approximateCost?: number;
  travels?: string[];
  pois?: {
    tourism?: string[];
    food?: string[];
    cafes?: string[];
    nature?: string[];
  };
}

export interface GlobeHandle {
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
}

interface GlobeProps {
  locations: Location[];
  onStateChange?: (state: { isPlaying: boolean; isPausedAtStop: boolean; currentStep: number }) => void;
}

// --- Helpers ---

const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const getCurvePoints = (p1: THREE.Vector3, p2: THREE.Vector3, radius: number) => {
  const points = [];
  const distance = p1.distanceTo(p2);
  const steps = Math.max(20, Math.ceil(distance * 10));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = new THREE.Vector3().lerpVectors(p1, p2, t);
    p.normalize().multiplyScalar(radius);
    const height = Math.sin(t * Math.PI) * (distance * 0.2); 
    p.multiplyScalar(1 + height / radius);
    points.push(p);
  }
  return points;
};

// --- Sub-Components ---

const CloudSphere = ({ radius }: { radius: number }) => {
  const cloudRef = useRef<THREE.Mesh>(null);
  const cloudsMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');

  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0002; // Slower rotation for less visual noise
    }
  });

  return (
    <mesh ref={cloudRef}>
      <sphereGeometry args={[radius + 0.05, 64, 64]} />
      <meshPhongMaterial
        map={cloudsMap}
        transparent
        opacity={0.4}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

const Marker: React.FC<{ 
  position: THREE.Vector3; 
  color: string; 
  label?: string; 
  day?: number; 
  isFirst?: boolean; 
  isLast?: boolean;
  activities?: string[];
  stay?: string;
  weather?: string;
  approximateCost?: number;
  pois?: Location['pois'];
  showInfo?: boolean; // New prop to force show info
}> = ({ position, color, label, day, isFirst, isLast, activities, stay, weather, approximateCost, pois, showInfo }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  
  const quaternion = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const target = position.clone().normalize();
    return new THREE.Quaternion().setFromUnitVectors(up, target);
  }, [position]);

  // Determine marker type label
  const typeLabel = isFirst ? "START" : isLast ? "END" : day ? `DAY ${day}` : "";
  
  // Extract short name (city only, before comma)
  const shortLabel = label ? label.split(',')[0].trim() : '';

  const weatherIcon = {
    sunny: '☀️',
    cloudy: '☁️',
    'partly cloudy': '⛅',
    rainy: '🌧️',
  }[weather?.toLowerCase() || 'sunny'] || '🌤️';

  const shouldShowInfo = isHovered || showInfo;

  return (
    <group 
      ref={groupRef} 
      position={position} 
      quaternion={quaternion}
      onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setIsHovered(false); }}
    >
      {/* Enhanced Base Marker with Pulsing Effect */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.03, 0.06, 32]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={shouldShowInfo ? 0.8 : 0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Vertical Pin Line */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.2, 8]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>

      {/* Info Panel - Shows on Hover or when Active in Playback */}
      {shouldShowInfo && (
        <Html 
          position={[0, 0.4, 0]} 
          center 
          occlude={[groupRef as React.RefObject<THREE.Object3D>]}
          style={{ 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            opacity: shouldShowInfo ? 1 : 0, 
            pointerEvents: 'none',
            transform: shouldShowInfo ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
            zIndex: 1000
          }}
        >
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            minWidth: '280px',
            maxWidth: '320px',
            color: 'white',
            fontFamily: 'Inter, system-ui, sans-serif'
          }}>
            {/* Header Section */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                {typeLabel && (
                  <div style={{
                    display: 'inline-block',
                    background: isFirst ? '#10b981' : isLast ? '#ef4444' : '#f59e0b',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '800',
                    marginBottom: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {typeLabel}
                  </div>
                )}
                <div style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.2' }}>
                  {shortLabel}
                </div>
              </div>
              <div style={{ fontSize: '20px' }}>{weatherIcon}</div>
            </div>

            {/* Content Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stay && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1', background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '8px' }}>
                  <FaHotel style={{ color: '#60a5fa' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stay}</span>
                </div>
              )}
              
              {activities && activities.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600' }}>Activities</div>
                  {activities.slice(0, 3).map((act, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: '#e2e8f0' }}>
                      <span style={{ color: '#fbbf24', marginTop: '2px' }}>•</span>
                      <span style={{ lineHeight: '1.3' }}>{act}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* POIs Section */}
              {pois && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '4px' }}>
                  {pois.tourism && pois.tourism.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#a78bfa', marginBottom: '2px' }}>
                        <FaLandmark /> <span>Tourism</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pois.tourism[0]}
                      </div>
                    </div>
                  )}
                  {pois.food && pois.food.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f472b6', marginBottom: '2px' }}>
                        <FaUtensils /> <span>Food</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pois.food[0]}
                      </div>
                    </div>
                  )}
                  {pois.cafes && pois.cafes.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#fbbf24', marginBottom: '2px' }}>
                        <FaCoffee /> <span>Cafes</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pois.cafes[0]}
                      </div>
                    </div>
                  )}
                  {pois.nature && pois.nature.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#4ade80', marginBottom: '2px' }}>
                        <FaTree /> <span>Nature</span>
                      </div>
                      <div style={{ fontSize: '10px', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pois.nature[0]}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cost Footer */}
              {approximateCost && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontWeight: '600', fontSize: '13px' }}>
                  <FaCoins />
                  <span>₹{approximateCost.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// --- Main Component ---

const Globe = forwardRef<GlobeHandle, GlobeProps>(({ locations, onStateChange }, ref) => {
  const radius = 5;
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const vehicleRef = useRef<THREE.Group>(null);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 to locations.length - 1
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 1 for current segment
  const [isPausedAtStop, setIsPausedAtStop] = useState(false);
  const playbackSpeed = 0.005; // Speed of travel
  const pauseDuration = 180; // Frames to pause at each stop (approx 3 seconds at 60fps)
  const pauseTimer = useRef(0);
  const [showTravelInfo, setShowTravelInfo] = useState(false);
  const [currentTravelMode, setCurrentTravelMode] = useState<string>('');
  
  // Refs for optimization
  const lastReportedState = useRef({ isPlaying: false, isPausedAtStop: false, currentStep: 0 });
  const lastTravelMode = useRef<string>('');
  const lastShowTravelInfo = useRef<boolean>(false);

  // Report state changes (Optimized)
  useEffect(() => {
    const newState = { isPlaying, isPausedAtStop, currentStep };
    if (
      newState.isPlaying !== lastReportedState.current.isPlaying ||
      newState.isPausedAtStop !== lastReportedState.current.isPausedAtStop ||
      newState.currentStep !== lastReportedState.current.currentStep
    ) {
      onStateChange?.(newState);
      lastReportedState.current = newState;
    }
  }, [isPlaying, isPausedAtStop, currentStep, onStateChange]);

  // Expose controls
  useImperativeHandle(ref, () => ({
    play: () => {
      setIsPlaying(true);
      if (currentStep === locations.length - 1) {
        setCurrentStep(0);
        setPlaybackProgress(0);
      }
      setIsPausedAtStop(true);
      pauseTimer.current = 0;
    },
    pause: () => {
      setIsPlaying(false);
    },
    stop: () => {
      setIsPlaying(false);
      setCurrentStep(0);
      setPlaybackProgress(0);
      setIsPausedAtStop(false);
      if (locations.length > 0) {
        const startPos = latLngToVector3(locations[0].lat, locations[0].lng, radius);
        const cameraOffset = startPos.clone().normalize().multiplyScalar(14); 
        camera.position.copy(cameraOffset);
      }
    },
    next: () => {
      if (currentStep < locations.length - 1) {
        setCurrentStep(prev => prev + 1);
        setPlaybackProgress(0);
        setIsPausedAtStop(true);
        pauseTimer.current = 0;
      }
    },
    prev: () => {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
        setPlaybackProgress(0);
        setIsPausedAtStop(true);
        pauseTimer.current = 0;
      }
    }
  }));

  // Load High-Res Textures (4K for better quality)
  const [colorMap, normalMap, specularMap] = useTexture([
    'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg', // 4K Earth texture
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  const markers = useMemo(() => {
    return locations.map(loc => ({
      ...loc,
      position: latLngToVector3(loc.lat, loc.lng, radius)
    }));
  }, [locations, radius]);

  const pathSegments = useMemo(() => {
    const segments = [];
    for (let i = 0; i < markers.length - 1; i++) {
      const start = markers[i].position;
      const end = markers[i+1].position;
      segments.push(getCurvePoints(start, end, radius));
    }
    return segments;
  }, [markers, radius]);

  // Auto-focus camera on the first location (start of route)
  useEffect(() => {
    if (markers.length > 0 && !isPlaying && controlsRef.current) {
      const startPos = markers[0].position;
      const cameraOffset = startPos.clone().normalize().multiplyScalar(14); 
      camera.position.copy(cameraOffset);
      controlsRef.current.update();
    }
  }, [markers, camera, isPlaying]);

  // Animation Loop
  useFrame(() => {
    if (isPlaying && markers.length > 1) {
      if (isPausedAtStop) {
        // Only update state if it changes
        if (lastShowTravelInfo.current) {
          setShowTravelInfo(false);
          lastShowTravelInfo.current = false;
        }

        // Paused at a location
        pauseTimer.current++;
        
        // Slowly rotate around the point of interest while paused
        const currentMarker = markers[currentStep];
        const targetPos = currentMarker.position;
        const lookPos = targetPos.clone().normalize().multiplyScalar(radius);
        
        // Smoothly look at the target
        camera.lookAt(lookPos);
        
        if (pauseTimer.current >= pauseDuration) {
          setIsPausedAtStop(false);
          pauseTimer.current = 0;
          
          // If we just finished the last stop, end playback
          if (currentStep >= markers.length - 1) {
            setIsPlaying(false);
            setCurrentStep(0);
          }
        }
      } else {
        // Traveling between locations
        const nextMarker = markers[currentStep + 1];
        
        // Update Travel Info State (Optimized)
        if (nextMarker?.travels) {
           const travels = nextMarker.travels;
           if (travels && travels.length > 0) {
             const modeStr = travels.join(', ');
             if (modeStr !== lastTravelMode.current) {
               setCurrentTravelMode(modeStr);
               lastTravelMode.current = modeStr;
             }
             if (!lastShowTravelInfo.current) {
               setShowTravelInfo(true);
               lastShowTravelInfo.current = true;
             }
           }
        }

        if (currentStep >= markers.length - 1) {
           setIsPlaying(false);
           return;
        }

        const nextProgress = playbackProgress + playbackSpeed;
        
        if (nextProgress >= 1) {
          // Arrived at next stop
          setPlaybackProgress(0);
          setCurrentStep(prev => prev + 1);
          setIsPausedAtStop(true);
          pauseTimer.current = 0;
        } else {
          setPlaybackProgress(nextProgress);
          
          // Interpolate position along the curve
          const segmentPoints = pathSegments[currentStep];
          if (segmentPoints) {
            const pointIndex = Math.floor(nextProgress * (segmentPoints.length - 1));
            const targetPoint = segmentPoints[pointIndex];
            
            // Calculate next point for rotation (tangent)
            const nextPointIndex = Math.min(pointIndex + 1, segmentPoints.length - 1);
            const nextPoint = segmentPoints[nextPointIndex];
            
            if (targetPoint) {
              // --- Dynamic Camera Logic ---
              
              // 1. Determine Base Zoom - MODERATE AND BALANCED
              const vehicleType = getVehicleType();
              let targetHeight = 10; // Moderate default view
              
              if (vehicleType === 'car' || vehicleType === 'bus' || vehicleType === 'train') {
                targetHeight = 8.5; // Close enough to see details, not too close
              } else if (vehicleType === 'flight') {
                targetHeight = 11; // Pull back for flights
              }

              // 2. Adjust for Segment Length
              const segmentLength = segmentPoints.length;
              if (segmentLength < 50) { // Short trip
                 targetHeight *= 0.88; // Slight zoom for short trips
              }

              // 3. Calculate Camera Position
              // We want to be behind and slightly above the vehicle
              const cameraPos = targetPoint.clone().normalize().multiplyScalar(targetHeight);
              
              // Smoothly lerp camera position for very fluid movement
              camera.position.lerp(cameraPos, 0.06); // Balanced lerp for smooth tracking
              
              // Look at the target (vehicle)
              camera.lookAt(targetPoint);

              // Update Vehicle Position and Rotation
              if (vehicleRef.current) {
                // For ground vehicles, position ON the globe surface
                // For flights, use the elevated path point
                const vehicleType = getVehicleType();
                let vehiclePosition: THREE.Vector3;
                
                if (vehicleType === 'flight') {
                  // Flights stay on the elevated path
                  vehiclePosition = targetPoint.clone();
                } else {
                  // Ground vehicles (car/bus/train) are positioned ON the globe surface
                  vehiclePosition = targetPoint.clone().normalize().multiplyScalar(radius);
                }
                
                vehicleRef.current.position.copy(vehiclePosition);
                
                if (nextPoint) {
                  // Smooth rotation using quaternion slerp
                  const targetQuaternion = new THREE.Quaternion();
                  const direction = new THREE.Vector3().subVectors(nextPoint, targetPoint).normalize();
                  const up = vehiclePosition.clone().normalize();
                  const matrix = new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), direction, up);
                  targetQuaternion.setFromRotationMatrix(matrix);
                  vehicleRef.current.quaternion.slerp(targetQuaternion, 0.2);
                }
              }
            }
          }
        }
      }
    }
  });

  // Determine vehicle type
  const getVehicleType = () => {
    const mode = currentTravelMode.toLowerCase();
    if (mode.includes('flight') || mode.includes('plane') || mode.includes('air')) return 'flight';
    if (mode.includes('train') || mode.includes('rail')) return 'train';
    if (mode.includes('bus')) return 'bus';
    return 'car';
  };

  return (
    <group>
      {/* Bright Animated Lighting Setup - No Dark Sides */}
      
      {/* Strong Ambient Light - Ensures everything is bright */}
      <ambientLight intensity={1.2} />
      
      {/* Bright Hemisphere Light - Vibrant sky lighting */}
      <hemisphereLight args={['#ffffff', '#e0f2ff', 1.5]} />
      
      {/* Main Light - Bright from front */}
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={2.5} 
        color="#ffffff" 
      />
      
      {/* Fill Lights - Ensure no dark sides */}
      <directionalLight 
        position={[-10, 5, 10]} 
        intensity={1.8} 
        color="#ffffff" 
      />
      
      <directionalLight 
        position={[0, -5, -10]} 
        intensity={1.5} 
        color="#f0f9ff" 
      />
      
      {/* Top Light - Bright overhead */}
      <directionalLight 
        position={[0, 15, 0]} 
        intensity={1.2} 
        color="#ffffff" 
      />
      
      {/* Camera Follow Light - Extra brightness on viewed side */}
      <pointLight 
        position={camera.position} 
        intensity={1.5} 
        distance={50} 
        decay={1.5}
        color="#ffffff"
      />
      
      {/* Colorful Accent Lights for Animation Feel */}
      <pointLight 
        position={[8, 8, 8]} 
        intensity={0.8} 
        distance={40} 
        color="#60a5fa"
      />
      
      <pointLight 
        position={[-8, 8, -8]} 
        intensity={0.8} 
        distance={40} 
        color="#fbbf24"
      />

      {/* --- Realistic Earth --- */}
      
      {/* 1. Surface - High Res with Normal and Specular */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          specularMap={specularMap}
          specular={new THREE.Color('grey')}
          shininess={10}
        />
      </mesh>

      {/* 2. Clouds Layer - Animated */}
      <CloudSphere radius={radius} />

      {/* 3. Atmosphere Glow - Bright and Vibrant */}
      <Sphere args={[radius + 0.3, 64, 64]}>
        <meshBasicMaterial 
          color="#60a5fa" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* --- Content --- */}

      {/* Enhanced Markers with Day Information */}
      {markers.map((marker, idx) => (
        <Marker 
          key={idx} 
          position={marker.position} 
          color={idx === 0 ? "#4ade80" : idx === markers.length - 1 ? "#f87171" : "#fbbf24"}
          label={marker.name}
          day={marker.day}
          activities={marker.activities}
          stay={marker.stay}
          weather={marker.weather}
          approximateCost={marker.approximateCost}
          pois={marker.pois}
          isFirst={idx === 0}
          isLast={idx === markers.length - 1}
          showInfo={isPlaying && currentStep === idx && isPausedAtStop}
        />
      ))}

      {/* Paths - Visible but not overpowering */}
      {pathSegments.map((points, idx) => (
        <group key={idx}>
          {/* Core Line */}
          <Line 
            points={points} 
            color="#fbbf24" 
            lineWidth={2.5} 
            transparent
            opacity={1}
          />
          {/* Glow Line */}
          <Line 
            points={points} 
            color="#fbbf24" 
            lineWidth={7} 
            transparent
            opacity={0.3}
          />
        </group>
      ))}

      {/* Vehicle Animation - ON GLOBE SURFACE */}
      {isPlaying && !isPausedAtStop && (
        <Vehicle 
          ref={vehicleRef}
          position={[0, 0, 0]} 
          rotation={[0, 0, 0]} 
          color="#60a5fa" 
          type={getVehicleType()}
          scale={getVehicleType() === 'flight' ? 0.4 : 0.25} // Much smaller, grounded scale
        />
      )}

      {/* Controls */}
      <OrbitControls 
        ref={controlsRef}
        enablePan={false} 
        minDistance={6} 
        maxDistance={20} 
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        enabled={!isPlaying} // Disable manual control during playback
      />

      {/* Travel Info Overlay - Shows during movement */}
      {showTravelInfo && isPlaying && !isPausedAtStop && (
        <Html position={[0, 0, 0]} style={{ pointerEvents: 'none', width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 400 }}>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(59, 130, 246, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '10px 20px',
            borderRadius: '30px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            <span style={{ fontSize: '18px' }}>✈️</span>
            <span>Traveling: {currentTravelMode}</span>
          </div>
        </Html>
      )}

      {/* Playback UI Removed - Controlled externally */}
    </group>
  );
});

export default Globe;
