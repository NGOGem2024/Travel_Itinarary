import React, { useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Globe, { type GlobeHandle } from './Globe';
import type { Itinerary } from '../../types/itinerary';
import { FaPlay, FaPause, FaStop, FaStepForward, FaStepBackward } from 'react-icons/fa';

interface RouteVisualizerProps {
  itinerary: Itinerary;
}

const RouteVisualizer: React.FC<RouteVisualizerProps> = ({ itinerary }) => {
  const globeRef = useRef<GlobeHandle>(null);
  const [playbackState, setPlaybackState] = useState({
    isPlaying: false,
    isPausedAtStop: false,
    currentStep: 0
  });

  const locations = useMemo(() => {
    const locs = [];

    // Start Point
    if (itinerary.coordinates?.start) {
      locs.push({
        lat: itinerary.coordinates.start.lat,
        lng: itinerary.coordinates.start.lng,
        name: itinerary.from,
        day: 0
      });
    }

    // Day Plans
    itinerary.dayPlans.forEach(day => {
      if (day.coordinates) {
        locs.push({
          lat: day.coordinates.lat,
          lng: day.coordinates.lng,
          name: day.location || `Day ${day.day}`,
          day: day.day,
          activities: day.activities,
          stay: day.stay,
          weather: day.weather,
          approximateCost: day.approximateCost,
          travels: day.travels,
          pois: day.pois
        });
      }
    });

    // End Point
    if (itinerary.coordinates?.end) {
      const lastLoc = locs[locs.length - 1];
      if (!lastLoc || (Math.abs(lastLoc.lat - itinerary.coordinates.end.lat) > 0.1)) {
        locs.push({
          lat: itinerary.coordinates.end.lat,
          lng: itinerary.coordinates.end.lng,
          name: itinerary.to,
          day: itinerary.days + 1
        });
      }
    }

    if (locs.length === 0) {
      return [{ lat: 20, lng: 0, name: 'No Coordinates Available' }];
    }

    return locs;
  }, [itinerary]);

  return (
    <div style={{ width: '100%', height: '100%', background: '#e0f2fe', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
        <color attach="background" args={['#e0f2fe']} />
        <Globe 
          ref={globeRef} 
          locations={locations} 
          onStateChange={setPlaybackState}
        />
      </Canvas>
      
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(0,0,0,0.5)',
        fontSize: '0.9rem',
        pointerEvents: 'none',
        textShadow: '0 2px 4px rgba(255,255,255,0.8)',
        fontWeight: '600',
        display: playbackState.isPlaying ? 'none' : 'block'
      }}>
        Drag to rotate • Scroll to zoom
      </div>

      {/* Premium Vertical Control Panel */}
      <div style={{
        position: 'absolute',
        right: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        zIndex: 1000,
        pointerEvents: 'none' // Allow clicking through the container area
      }}>
        
        {/* Timeline / Progress Indicator */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(12px)',
          padding: '20px 12px',
          borderRadius: '40px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto',
          transition: 'all 0.3s ease'
        }}>
          {locations.map((_, idx) => (
            <div 
              key={idx}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: idx === playbackState.currentStep ? '#3b82f6' : idx < playbackState.currentStep ? '#10b981' : 'rgba(255,255,255,0.2)',
                boxShadow: idx === playbackState.currentStep ? '0 0 10px #3b82f6' : 'none',
                transition: 'all 0.3s ease',
                transform: idx === playbackState.currentStep ? 'scale(1.5)' : 'scale(1)'
              }}
            />
          ))}
        </div>

        {/* Main Controls */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          padding: '24px 16px',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          pointerEvents: 'auto'
        }}>
          
          {/* Play/Pause - Hero Button */}
          {!playbackState.isPlaying ? (
            <button 
              onClick={() => globeRef.current?.play()}
              style={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px',
                boxShadow: '0 10px 20px rgba(37, 99, 235, 0.4)',
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Play Tour"
            >
              <FaPlay style={{ marginLeft: '4px' }} />
            </button>
          ) : (
            <button 
              onClick={() => globeRef.current?.pause()}
              style={{ 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer', 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '20px',
                boxShadow: '0 10px 20px rgba(220, 38, 38, 0.4)',
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Pause Tour"
            >
              <FaPause />
            </button>
          )}

          {/* Navigation Group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => globeRef.current?.prev()}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                title="Previous Stop"
              >
                <FaStepBackward size={12} />
              </button>
              <button 
                onClick={() => globeRef.current?.next()}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                title="Next Stop"
              >
                <FaStepForward size={12} />
              </button>
            </div>
            
            <button 
              onClick={() => globeRef.current?.stop()}
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#94a3b8', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', fontSize: '12px' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#94a3b8'; }}
              title="Stop Tour"
            >
              <FaStop />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteVisualizer;
