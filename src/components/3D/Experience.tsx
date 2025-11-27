import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Map3D from './Map3D';
import Summary from '../Summary/Summary';
import type { DayPlan, Itinerary } from '../../types/itinerary';

interface Props {
  plans: DayPlan[];
  itinerary: Itinerary;
  onDayChange?: (day: number) => void;
}

const Experience: React.FC<Props> = ({ plans, itinerary, onDayChange }) => {
  // 1 page for summary, plus pages for itinerary
  const totalPages = plans.length + 1;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
      <Canvas shadows camera={{ position: [0, 10, 20], fov: 50 }}>
        <color attach="background" args={['#0f172a']} />
        <fog attach="fog" args={['#0f172a', 10, 50]} />
        <ScrollControls pages={totalPages} damping={0.2}>
          <Scroll html style={{ width: '100%' }}>
            <Summary itinerary={itinerary} />
          </Scroll>
          <Map3D plans={plans} onDayChange={onDayChange} totalPages={totalPages} />
        </ScrollControls>
      </Canvas>
    </div>
  );
};

export default Experience;
