import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Map3D from './Map3D';
import Summary from '../Summary/Summary';
import type { DayPlan, Itinerary } from '../../types/itinerary';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Props {
  plans: DayPlan[];
  itinerary: Itinerary;
  onDayChange?: (day: number) => void;
  currentDay?: number;
}

const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

const ExperienceFallback: React.FC<{ 
  onDayChange?: (day: number) => void; 
  currentDay: number;
  totalDays: number;
}> = ({ onDayChange, currentDay, totalDays }) => {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'white',
      background: 'linear-gradient(to bottom, #0f172a, #1e293b)',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>3D View Unavailable</h2>
      <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
        Your device or browser doesn't support WebGL, but you can still view your itinerary below.
      </p>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <button 
          onClick={() => onDayChange?.(Math.max(1, currentDay - 1))}
          disabled={currentDay <= 1}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            padding: '1rem',
            borderRadius: '50%',
            cursor: currentDay <= 1 ? 'not-allowed' : 'pointer',
            opacity: currentDay <= 1 ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaChevronLeft size={24} />
        </button>

        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Day {currentDay} / {totalDays}
        </div>

        <button 
          onClick={() => onDayChange?.(Math.min(totalDays, currentDay + 1))}
          disabled={currentDay >= totalDays}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: 'white',
            padding: '1rem',
            borderRadius: '50%',
            cursor: currentDay >= totalDays ? 'not-allowed' : 'pointer',
            opacity: currentDay >= totalDays ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

const Experience: React.FC<Props> = ({ plans, itinerary, onDayChange, currentDay = 1 }) => {
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
  }, []);

  // 1 page for summary, plus pages for itinerary
  const totalPages = plans.length + 1;

  if (!webGLSupported) {
    return (
      <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
        <ExperienceFallback 
          onDayChange={onDayChange} 
          currentDay={currentDay} 
          totalDays={plans.length} 
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      <ErrorBoundary fallback={
        <ExperienceFallback 
          onDayChange={onDayChange} 
          currentDay={currentDay} 
          totalDays={plans.length} 
        />
      }>
        <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
          <color attach="background" args={['#e0f2fe']} />
          <ScrollControls pages={totalPages} damping={0.2}>
            <Scroll html style={{ width: '100%' }}>
              <Summary itinerary={itinerary} />
            </Scroll>
            <Map3D plans={plans} onDayChange={onDayChange} totalPages={totalPages} />
          </ScrollControls>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default Experience;
