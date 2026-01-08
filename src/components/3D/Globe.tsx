import React, { useMemo, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Sphere, OrbitControls, Line, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { FaHotel } from 'react-icons/fa';
import { Vehicle } from './Assets';

interface Location {
  lat: number;
  lng: number;
  name: string;
  day?: number;
  date?: string; // Add date
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
  hotelOptions?: import('../../types/itinerary').HotelOption[];
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
  onHotelSelect?: (day: number, hotel: import('../../types/itinerary').HotelOption) => void;
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

const getCurvePoints = (p1: THREE.Vector3, p2: THREE.Vector3, radius: number, isAirTravel: boolean = false) => {
  const points = [];
  const distance = p1.distanceTo(p2);
  const steps = Math.max(20, Math.ceil(distance * 10));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = new THREE.Vector3().lerpVectors(p1, p2, t);
    p.normalize().multiplyScalar(radius);
    
    // Only add elevation for air travel (flights)
    if (isAirTravel) {
      const height = Math.sin(t * Math.PI) * (distance * 0.2); 
      p.multiplyScalar(1 + height / radius);
    }
    
    points.push(p);
  }
  return points;
};

// Helper function to determine if travel mode is air-based
const isAirTravel = (travels?: string[]): boolean => {
  if (!travels || travels.length === 0) return false;
  const mode = travels.join(' ').toLowerCase();
  return mode.includes('flight') || mode.includes('plane') || mode.includes('air');
};

// --- Sub-Components ---

// --- Sub-Components ---

const CloudSphere = ({ radius }: { radius: number }) => {
  const cloudRef = useRef<THREE.Mesh>(null);
  const cloudsMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');

  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0002;
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

// Enhanced Stylized Marker - Uses HTML/Billboard for perfect visibility
const StylizedMarker: React.FC<{ 
  position: THREE.Vector3; 
  color: string; 
  label?: string; 
  day?: number; 
  date?: string;
  isFirst?: boolean; 
  isLast?: boolean;
  activities?: string[];
  stay?: string;
  weather?: string;
  approximateCost?: number;
  travels?: string[];
  pois?: {
    tourism?: string[];
    food?: string[];
    cafes?: string[];
    nature?: string[];
  };
  hotelOptions?: import('../../types/itinerary').HotelOption[];
  onHotelSelect?: (hotel: import('../../types/itinerary').HotelOption) => void;
  showInfo?: boolean; 
  onInteractionChange?: (blocked: boolean) => void;
}> = ({ position, color, label, day, date, isFirst, isLast, activities, stay, weather, approximateCost, travels, pois, hotelOptions, onHotelSelect, showInfo, onInteractionChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isHotelListOpen, setIsHotelListOpen] = useState(false); 
  const [isFocused, setIsFocused] = useState(false); // New Focus State
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Logic: Show info if hovered, interacting, OR FOCUSED
  const shouldShowInfo = isHovered || isInteracting || showInfo || isFocused;

  // Determine Icon
  const getIcon = () => {
    if (isFirst) return <div style={{ fontSize: '24px' }}>🚩</div>;
    if (isLast) return <div style={{ fontSize: '24px' }}>🏁</div>;
    return <FaHotel size={20} color="white" />;
  };

  const typeLabel = isFirst ? "START" : isLast ? "END" : day ? `DAY ${day}` : "";
  const shortLabel = label ? label.split(',')[0].trim() : '';

  const weatherIcon = {
    sunny: '☀️',
    cloudy: '☁️',
    'partly cloudy': '⛅',
    rainy: '🌧️',
  }[weather?.toLowerCase() || 'sunny'] || '🌤️';

  return (
    <group position={position}>
      {/* HTML Marker - Fixed screen size (no distanceFactor) */}
      <Html
        position={[0, 0, 0]}
        center
        style={{
          pointerEvents: 'none', 
          zIndex: isFocused ? 5000 : (shouldShowInfo ? 1000 : 100), // Huge Z-Index for focus 
        }}
      >
        <div 
          onMouseEnter={() => !isFocused && setIsHovered(true)}
          onMouseLeave={() => { 
            setIsHovered(false); 
            if (!isInteracting && !isFocused) {
                 setIsHotelListOpen(false); 
            }
          }}
          onClick={(e) => {
             e.stopPropagation();
             setIsFocused(!isFocused);
             setIsHotelListOpen(false); // Reset list when toggling mode
             onInteractionChange?.(true); // Block interaction immediately on click
          }}
          style={{
            pointerEvents: 'auto', 
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            paddingBottom: '20px' // Invisible padding to bridge gap to popup
          }}
        >
          {/* Main Pin Icon */}
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${color} 0%, ${adjustColorBrightness(color, -20)} 100%)`,
            border: '3px solid rgba(255, 255, 255, 0.8)',
            boxShadow: `0 8px 16px -4px ${color}80, 0 0 0 4px rgba(255,255,255,0.1)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transform: `scale(${shouldShowInfo ? 1.1 : 1})`,
            transition: 'transform 0.2s',
            marginBottom: '4px'
          }}>
            {getIcon()}
            <div style={{
              position: 'absolute',
              top: '-3px', left: '-3px', right: '-3px', bottom: '-3px',
              borderRadius: '50%',
              border: `2px solid ${color}`,
              opacity: 0,
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            }} />
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '11px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            opacity: 0.9,
          }}>
            {shortLabel}
          </div>
          
          {/* Detailed Info Popover */}
          {shouldShowInfo && (
             <>
             {/* Backdrop: Only show on Mobile to block interaction behind functionality */}
             {(isMobile && (isFocused || isMobile)) && <div style={{ 
                 position: 'fixed',
                 top: 0, left: 0, right: 0, bottom: 0,
                 background: 'rgba(0,0,0,0.4)',
                 backdropFilter: 'blur(4px)',
                 zIndex: -1,
                 pointerEvents: 'auto',
                 cursor: 'default'
             }} onClick={(e) => { 
                e.stopPropagation(); 
                setIsFocused(false);
                onInteractionChange?.(false); 
             }} />}
             
             <div 
                onMouseEnter={() => {
                  setIsInteracting(true);
                  onInteractionChange?.(true); // Block interaction on hover
                }}
                onMouseLeave={() => {
                  setIsInteracting(false);
                  onInteractionChange?.(false); // Unblock interaction on leave
                }}
                onClick={(e) => e.stopPropagation()} // Prevent click propagating to close
                style={{
                  position: (isFocused || isMobile) ? 'fixed' : 'absolute',
                  ...((isFocused || isMobile) ? {
                      // Mobile: Bottom Sheet
                      ...(isMobile ? {
                          top: 'auto',
                          bottom: '0',
                          left: '0',
                          right: '0',
                          width: '100vw', 
                          maxWidth: '100%',
                          maxHeight: '80vh',
                          borderRadius: '24px 24px 0 0',
                          transform: 'none',
                          margin: 0
                      } : {
                          // Desktop: Side Panel (Right)
                          top: '2rem',
                          right: '2rem',
                          bottom: '2rem',
                          left: 'auto',
                          width: '420px',
                          maxWidth: '90vw',
                          height: 'calc(100vh - 4rem)',
                          maxHeight: 'calc(100vh - 4rem)',
                          borderRadius: '20px',
                          transform: 'none',
                          margin: 0
                      })
                  } : {
                      // Hover State (not focused)
                      top: '100%', 
                      marginTop: '6px',
                      width: '340px',
                      maxHeight: '400px',
                  }),
                  
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  padding: isFocused ? '24px' : '16px',
                  boxShadow: '0 20px 40px -5px rgba(0,0,0,0.4)',
                  color: 'white',
                  animation: 'fadeIn 0.2s ease-out',
                  pointerEvents: 'auto',
                  overflowY: 'auto',
                  zIndex: 2000,
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column'
                }}
             >
                {/* Header */}
                <div style={{ 
                    paddingBottom: isFocused ? '16px' : '10px', 
                    borderBottom: '1px solid rgba(255,255,255,0.1)', 
                    marginBottom: isFocused ? '16px' : '10px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                   <div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: color, textTransform: 'uppercase', marginBottom: '4px' }}>{typeLabel}</div>
                      <div style={{ fontSize: isFocused ? '28px' : '18px', fontWeight: '700' }}>{shortLabel}</div> 
                   </div>
                   {isFocused ? (
                        <button onClick={(e) => {
                            e.stopPropagation();
                            setIsFocused(false);
                            onInteractionChange?.(false);
                        }} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', padding: '0 8px' }}>✕</button>
                   ) : (
                       <div style={{ fontSize: '24px' }}>{weatherIcon}</div>
                   )}
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: isFocused ? '16px' : '8px' }}>
                   
                   {/* Grid Layout for Focus Mode */}
                   {isFocused ? (
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                           
                           {/* Stay & Hotel Options */}
                           {stay && (
                               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#60a5fa', marginBottom: '8px', fontWeight: 600 }}>
                                        <FaHotel /> Accommodation
                                    </div>
                                    
                                    {/* Hotel Image */}
                                    {(() => {
                                        // Smart matching: Try exact match, then loose match, then fallback to first
                                        let currentHotel = hotelOptions?.find(h => h.name === stay);
                                        if (!currentHotel && hotelOptions && hotelOptions.length > 0) {
                                            currentHotel = hotelOptions[0];
                                        }

                                        const imageUrl = currentHotel?.imageUrl;
                                        if (imageUrl) {
                                            return (
                                                <div style={{ 
                                                    width: '100%', 
                                                    height: '140px', 
                                                    backgroundImage: `url(${imageUrl})`, 
                                                    backgroundSize: 'cover', 
                                                    backgroundPosition: 'center', 
                                                    borderRadius: '8px', 
                                                    marginBottom: '12px',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }} />
                                            );
                                        }
                                        return null;
                                    })()}

                                    <div style={{ fontSize: '16px', color: 'white', marginBottom: '12px' }}>{stay}</div>
                                    
                                    {hotelOptions && hotelOptions.length > 0 && onHotelSelect && (
                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                                            {!isHotelListOpen ? (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setIsHotelListOpen(true); }}
                                                    style={{ width: '100%', padding: '10px', background: `${color}20`, border: `1px solid ${color}60`, color: color, borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                                >
                                                    Change Hotel
                                                </button>
                                            ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {hotelOptions.map((option, idx) => (
                                                    <div key={idx} onClick={(e) => { e.stopPropagation(); onHotelSelect(option); setIsHotelListOpen(false); }}
                                                         style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        {option.imageUrl && (
                                                            <div style={{ 
                                                                width: '100%', 
                                                                height: '80px', 
                                                                backgroundImage: `url(${option.imageUrl})`, 
                                                                backgroundSize: 'cover', 
                                                                backgroundPosition: 'center', 
                                                                borderRadius: '6px', 
                                                                marginBottom: '8px'
                                                            }} />
                                                        )}
                                                        <div style={{ fontWeight: 600 }}>{option.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>⭐ {option.rating} • {option.price}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            )}
                                        </div>
                                    )}
                               </div>
                           )}

                           {/* Travel Info & Cost */}
                           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                               {date && (
                                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                       <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Date</div>
                                       <div style={{ fontSize: '16px', fontWeight: 600 }}>{date}</div>
                                   </div>
                               )}
                               
                               {approximateCost && (
                                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                       <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Est. Daily Budget</div>
                                       <div style={{ fontSize: '18px', fontWeight: 700, color: '#4ade80' }}>₹{approximateCost.toLocaleString()}</div>
                                   </div>
                               )}

                               {travels && travels.length > 0 && (
                                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                       <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Travel</div>
                                       <div style={{ fontSize: '14px', color: '#e2e8f0' }}>{travels.join(' → ')}</div>
                                   </div>
                               )}
                           </div>

                           {/* Highlights / POIs */}
                           {pois && (
                               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', gridColumn: '1 / -1' }}>
                                   <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#fbbf24' }}>✨ Highlights</div>
                                   <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                       {Object.entries(pois).map(([cat, items]) => (
                                           items && items.length > 0 && items.map((item, i) => (
                                               <span key={`${cat}-${i}`} style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                                                   {item}
                                               </span>
                                           ))
                                       ))}
                                   </div>
                               </div>
                           )}

                           {/* Activities */}
                           {activities && activities.length > 0 && (
                               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', gridColumn: '1 / -1' }}>
                                   <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#a78bfa' }}>🎯 Planned Activities</div>
                                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                       {activities.map((a, i) => (
                                           <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#e2e8f0' }}>
                                               <span style={{ color }}>•</span> {a}
                                           </div>
                                       ))}
                                   </div>
                               </div>
                           )}

                       </div>
                   ) : (
                       // Simple Layout for Hover
                       <>
                           {stay && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#e2e8f0' }}>
                                    <FaHotel style={{ color }} size={16} />
                                    <span style={{ fontWeight: 600 }}>Current Stay:</span>
                                 </div>
                                 <div style={{ fontSize: '13px', color: '#cbd5e1', paddingLeft: '24px', lineHeight: '1.5' }}>
                                    {stay}
                                 </div>
                                 
                                 {hotelOptions && hotelOptions.length > 0 && onHotelSelect && (
                                    <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                                       {!isHotelListOpen ? (
                                           <button 
                                              onClick={(e) => { e.stopPropagation(); setIsHotelListOpen(true); }}
                                              style={{ width: '100%', padding: '8px', background: `${color}20`, border: `1px solid ${color}60`, color: color, borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                                           >
                                              Change Hotel
                                           </button>
                                       ) : (
                                           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                              {hotelOptions.map((option, idx) => (
                                                 <div key={idx} onClick={(e) => { e.stopPropagation(); onHotelSelect(option); setIsHotelListOpen(false); }}
                                                      style={{ padding: '8px', borderRadius: '8px', background: option.name === stay ? `${color}30` : 'rgba(0,0,0,0.2)', cursor: 'pointer', fontSize: '12px' }}>
                                                    <div style={{ fontWeight: 600 }}>{option.name}</div>
                                                 </div>
                                              ))}
                                           </div>
                                       )}
                                    </div>
                                 )}
                              </div>
                           )}
                           
                           {activities && activities.length > 0 && !isHotelListOpen && (
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                 {activities.slice(0, 2).map((a, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                                       <span style={{ color }}>•</span> {a}
                                    </div>
                                 ))}
                              </div>
                           )}
                       </>
                   )}
                </div>
             </div>
             </>
          )}
        </div>
      </Html>
      
      {/* 3D Anchor Line to Surface */}
      <mesh position={[0, isHovered ? 2 : 1, 0]}>
         <cylinderGeometry args={[0.02, 0.005, isHovered ? 4 : 2, 8]} />
         <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      
      {/* Ground Pulse Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
         <ringGeometry args={[0.1, 0.15, 32]} />
         <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

// Helper for color manipulation
const adjustColorBrightness = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#",""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

// --- Main Component ---

const Globe = forwardRef<GlobeHandle, GlobeProps>(({ locations, onStateChange, onHotelSelect }, ref) => {
  const radius = 5;
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const vehicleRef = useRef<THREE.Group>(null);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isPausedAtStop, setIsPausedAtStop] = useState(false);
  const playbackSpeed = 0.005; 
  const pauseDuration = 180; 
  const pauseTimer = useRef(0);
  const [showTravelInfo, setShowTravelInfo] = useState(false);
  const [currentTravelMode, setCurrentTravelMode] = useState<string>('');
  const [isInteractionBlocked, setIsInteractionBlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Load High-Res Textures
  const [colorMap, normalMap, specularMap] = useTexture([
    'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg', 
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  const markers = useMemo(() => {
    return locations.map(loc => ({
      ...loc,
      position: latLngToVector3(loc.lat, loc.lng, radius),
      isStart: loc.travels && loc.day === 0,
      isEnd: loc.day !== undefined && loc.day === locations[locations.length - 1].day
    }));
  }, [locations, radius]);

  const pathSegments = useMemo(() => {
    const segments = [];
    for (let i = 0; i < locations.length - 1; i++) {
      const start = latLngToVector3(locations[i].lat, locations[i].lng, radius);
      const end = latLngToVector3(locations[i+1].lat, locations[i+1].lng, radius);
      const isAir = isAirTravel(locations[i+1].travels);
      segments.push(getCurvePoints(start, end, radius, isAir));
    }
    return segments;
  }, [locations, radius]);

  // Auto-focus camera
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
        if (lastShowTravelInfo.current) {
          setShowTravelInfo(false);
          lastShowTravelInfo.current = false;
        }

        pauseTimer.current++;
        
        const currentMarker = markers[currentStep];
        const targetPos = currentMarker.position;
        const lookPos = targetPos.clone().normalize().multiplyScalar(radius);
        
        camera.lookAt(lookPos);
        
        if (pauseTimer.current >= pauseDuration) {
          setIsPausedAtStop(false);
          pauseTimer.current = 0;
          
          if (currentStep >= markers.length - 1) {
            setIsPlaying(false);
            setCurrentStep(0);
          }
        }
      } else {
        const nextMarker = markers[currentStep + 1];
        
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
          setPlaybackProgress(0);
          setCurrentStep(prev => prev + 1);
          setIsPausedAtStop(true);
          pauseTimer.current = 0;
        } else {
          setPlaybackProgress(nextProgress);
          
          const segmentPoints = pathSegments[currentStep];
          if (segmentPoints) {
            const pointIndex = Math.floor(nextProgress * (segmentPoints.length - 1));
            const targetPoint = segmentPoints[pointIndex];
            const nextPointIndex = Math.min(pointIndex + 1, segmentPoints.length - 1);
            const nextPoint = segmentPoints[nextPointIndex];
            
            if (targetPoint) {
              const totalDays = markers.length;
              const currentSegment = markers[currentStep];
              const nextSegment = markers[currentStep + 1];
              const segmentDistance = currentSegment?.position && nextSegment?.position 
                ? currentSegment.position.distanceTo(nextSegment.position)
                : 2;
              
              const vehicleType = getVehicleType();
              let baseZoom = 9;
              
              if (vehicleType === 'car' || vehicleType === 'bus' || vehicleType === 'train') {
                baseZoom = 7.5;
              } else if (vehicleType === 'flight') {
                baseZoom = 10;
              }

              let daysFactor = 1.0;
              if (totalDays <= 3) daysFactor = 0.85;
              else if (totalDays <= 7) daysFactor = 1.0;
              else if (totalDays <= 14) daysFactor = 1.15;
              else daysFactor = 1.3;

              let distanceFactor = 1.0;
              if (segmentDistance < 1.5) distanceFactor = 0.8;
              else if (segmentDistance < 3) distanceFactor = 0.9;
              else if (segmentDistance > 6) distanceFactor = 1.2;
              else if (segmentDistance > 8) distanceFactor = 1.4;

              const targetHeight = baseZoom * daysFactor * distanceFactor;
              const cameraPos = targetPoint.clone().normalize().multiplyScalar(targetHeight);
              
              camera.position.lerp(cameraPos, 0.06);
              camera.lookAt(targetPoint);

              if (vehicleRef.current) {
                const vehicleType = getVehicleType();
                let vehiclePosition: THREE.Vector3;
                
                if (vehicleType === 'flight') {
                  vehiclePosition = targetPoint.clone();
                } else {
                  vehiclePosition = targetPoint.clone().normalize().multiplyScalar(radius);
                }
                
                vehicleRef.current.position.copy(vehiclePosition);
                
                if (nextPoint) {
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

  const getVehicleType = () => {
    const mode = currentTravelMode.toLowerCase();
    if (mode.includes('flight') || mode.includes('plane') || mode.includes('air')) return 'flight';
    if (mode.includes('train') || mode.includes('rail')) return 'train';
    if (mode.includes('bus')) return 'bus';
    return 'car';
  };

  return (
    <group>
      <ambientLight intensity={1.2} />
      <hemisphereLight args={['#ffffff', '#e0f2ff', 1.5]} />
      <directionalLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-10, 5, 10]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[0, -5, -10]} intensity={1.5} color="#f0f9ff" />
      <directionalLight position={[0, 15, 0]} intensity={1.2} color="#ffffff" />
      <pointLight position={camera.position} intensity={1.5} distance={50} decay={1.5} color="#ffffff" />
      <pointLight position={[8, 8, 8]} intensity={0.8} distance={40} color="#60a5fa" />
      <pointLight position={[-8, 8, -8]} intensity={0.8} distance={40} color="#fbbf24" />

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

      <CloudSphere radius={radius} />

      <Sphere args={[radius + 0.3, 64, 64]}>
        <meshBasicMaterial 
          color="#60a5fa" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {markers.map((marker, idx) => (
        <StylizedMarker 
          key={idx}
          position={marker.position} 
          color={idx === 0 ? "#10b981" : idx === markers.length - 1 ? "#ef4444" : "#f59e0b"}
          label={marker.name}
          day={marker.day}
          activities={marker.activities}
          stay={marker.stay}
          weather={marker.weather}
          date={marker.date}
          approximateCost={marker.approximateCost}
          travels={marker.travels}
          pois={marker.pois}
          hotelOptions={marker.hotelOptions}
          onHotelSelect={onHotelSelect && marker.day ? (hotel) => onHotelSelect(marker.day!, hotel) : undefined}
          isFirst={idx === 0}
          isLast={idx === markers.length - 1}
          showInfo={isPlaying && currentStep === idx && isPausedAtStop}
          onInteractionChange={setIsInteractionBlocked}
        />
      ))}

      {pathSegments.map((points, idx) => (
        <group key={idx}>
          <Line 
            points={points} 
            color="#fbbf24" 
            lineWidth={5} // Bold Inner Line
            transparent
            opacity={1}
          />
          <Line 
            points={points} 
            color="#fbbf24" 
            lineWidth={12} // Massive Glow Line
            transparent
            opacity={0.3}
          />
        </group>
      ))}

      {isPlaying && !isPausedAtStop && (
        <Vehicle 
          ref={vehicleRef}
          position={[0, 0, 0]} 
          rotation={[0, 0, 0]} 
          color="#60a5fa" 
          type={getVehicleType()}
          scale={getVehicleType() === 'flight' 
            ? (isMobile ? 0.12 : 0.18) 
            : (isMobile ? 0.08 : 0.12)
          } 
        />
      )}

      <OrbitControls 
        ref={controlsRef}
        enablePan={false} 
        minDistance={6} 
        maxDistance={20} 
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        enabled={!isPlaying && !isInteractionBlocked} 
      />

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
    </group>
  );
});

export default Globe;
