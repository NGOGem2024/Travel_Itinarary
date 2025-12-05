import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Island, Building, Vehicle, StartMarker, EndMarker, HistoryMarker, FoodMarker, CafeMarker, TourismMarker, NatureMarker, Sun, CloudGroup, Rain } from './Assets';
import { Signboard, Tree, Rock, Bush, Airport, BackgroundScenery } from './EnhancedAssets';
import type { DayPlan } from '../../types/itinerary';

interface Props {
  plans: DayPlan[];
  onDayChange?: (day: number) => void;
  totalPages?: number;
}

const SceneContent: React.FC<Props> = ({ plans, onDayChange, totalPages = plans.length }) => {
  const scroll = useScroll();
  const curve = useMemo(() => {
    const points = [];
    // Create a randomized path
    for (let i = 0; i < plans.length; i++) {
      const baseX = (i % 2 === 0 ? 1 : -1) * 10;
      const randomOffsetX = (Math.random() - 0.5) * 6;
      const x = baseX + randomOffsetX;
      const y = -i * 15;
      const randomOffsetZ = (Math.random() - 0.5) * 4;
      const z = randomOffsetZ;
      points.push(new THREE.Vector3(x, y, z));
    }
    const lastX = (plans.length % 2 === 0 ? 1 : -1) * 10;
    points.push(new THREE.Vector3(lastX, -plans.length * 15, 0));
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, [plans]);

  const vehicleRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const summaryFraction = 1 / totalPages;
    const rawT = scroll.offset;
    const t = Math.max(0, (rawT - summaryFraction) / (1 - summaryFraction));

    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);

    const currentDayIndex = Math.min(Math.round(t * plans.length), plans.length - 1);
    const currentDay = plans[currentDayIndex]?.day || 1;
    if (onDayChange) {
      onDayChange(currentDay);
    }

    state.camera.position.lerp(new THREE.Vector3(point.x, point.y + 10, point.z + 20), 0.1);
    state.camera.lookAt(point.x, point.y, point.z);

    if (vehicleRef.current) {
      vehicleRef.current.position.copy(point);
      vehicleRef.current.lookAt(point.clone().add(tangent));
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />

      <BackgroundScenery />

      {plans.map((plan, i) => {
        if (i === plans.length - 1) return null;
        
        const segmentPoints = [];
        const steps = 20;
        for (let j = 0; j <= steps; j++) {
          const t = (i + (j/steps)) / plans.length;
          if (t <= 1) segmentPoints.push(curve.getPointAt(t));
        }
        
        const travelMode = plan.travels?.join(' ').toLowerCase() || '';
        const isAirTravel = travelMode.includes('flight') || travelMode.includes('plane') || travelMode.includes('air');
        
        return (
          <Line 
            key={`segment-${i}`}
            points={segmentPoints} 
            color={isAirTravel ? '#3b82f6' : '#475569'} 
            lineWidth={isAirTravel ? 3 : 5}
            dashed={isAirTravel}
            dashScale={isAirTravel ? 5 : 1}
            dashSize={isAirTravel ? 1 : 10}
            gapSize={isAirTravel ? 0.5 : 0}
          />
        );
      })}

      {(() => {
        const summaryFraction = 1 / totalPages;
        const rawT = scroll.offset;
        const t = Math.max(0, (rawT - summaryFraction) / (1 - summaryFraction));
        
        const totalSegments = plans.length - 1;
        const currentSegmentIndex = Math.min(Math.floor(t * totalSegments), totalSegments - 1);
        const currentPlan = plans[currentSegmentIndex];
        
        const travelModeStr = currentPlan?.travels?.join(' ').toLowerCase() || '';
        let vehicleType: 'car' | 'bus' | 'train' | 'flight' = 'car';
        if (travelModeStr.includes('flight') || travelModeStr.includes('plane') || travelModeStr.includes('air')) vehicleType = 'flight';
        else if (travelModeStr.includes('train') || travelModeStr.includes('rail')) vehicleType = 'train';
        else if (travelModeStr.includes('bus')) vehicleType = 'bus';
        
        return <Vehicle position={[0, 0, 0]} rotation={[0, 0, 0]} color="#6366f1" ref={vehicleRef} type={vehicleType} />
      })()}

      {plans.length > 0 && (() => {
         const start = curve.getPointAt(0);
         return <StartMarker position={[start.x, start.y, start.z]} />;
      })()}

      {plans.length > 0 && (() => {
         const end = curve.getPointAt(1);
         return <EndMarker position={[end.x, end.y, end.z]} />;
      })()}

      {plans.map((plan, i) => {
        const t = i / plans.length;
        const point = curve.getPointAt(t); 
        const tangent = curve.getTangentAt(t);
        const angle = Math.atan2(tangent.x, tangent.z);

        const biome = plan.biome || 'city';
        
        const travelModeDest = plan.travels?.join(' ').toLowerCase() || '';
        const travelModeOrigin = plans[i + 1]?.travels?.join(' ').toLowerCase() || '';
        const isFlightDest = travelModeDest.includes('flight') || travelModeDest.includes('plane');
        const isFlightOrigin = travelModeOrigin.includes('flight') || travelModeOrigin.includes('plane');
        const hasAirport = isFlightDest || isFlightOrigin;

        return (
          <group key={plan.day} position={[point.x, point.y, point.z]} rotation={[0, angle, 0]}>
            <Island position={[0, 0, 0]} biome={biome} />
            
            {hasAirport && (
              <Airport position={[i % 2 === 0 ? 2 : -2, 0.5, 0]} />
            )}

            {!hasAirport && (
               <group>
                 <Building position={[-1, 0, -1]} type="hotel" color="#f472b6" />
                 <group position={[1.5, 0, 1]} scale={[0.8, 0.8, 0.8]}>
                   <Tree position={[0, 0, 0]} />
                 </group>
                 <group position={[-1.5, 0, -1.5]} scale={[0.6, 0.6, 0.6]}>
                   <Tree position={[0, 0, 0]} />
                 </group>
               </group>
            )}

            {plan.weather === 'sunny' && <Sun position={[-4, 5, -3]} />}
            {(plan.weather === 'cloudy' || plan.weather === 'partly cloudy') && <CloudGroup position={[-4, 4, -3]} />}
            {plan.weather === 'rainy' && (
              <>
                <CloudGroup position={[-4, 4, -3]} />
                <Rain position={[-4, 3.5, -3]} />
              </>
            )}

            {plan.pois?.tourism?.map((_, idx) => (
               <TourismMarker key={`tour-${idx}`} position={[-3 + idx * 0.6, 0.5, 3]} />
            ))}
            {plan.pois?.history?.map((_, idx) => (
               <HistoryMarker key={`hist-${idx}`} position={[-2 + idx * 0.5, 0.5, 2]} />
            ))}
            {plan.pois?.food?.map((_, idx) => (
               <FoodMarker key={`food-${idx}`} position={[-2, 0.5, -2 + idx * 0.5]} />
            ))}
            {plan.pois?.cafes?.map((_, idx) => (
               <CafeMarker key={`cafe-${idx}`} position={[2, 0.5, -2 + idx * 0.5]} />
            ))}
            {plan.pois?.nature?.map((_, idx) => (
               <NatureMarker key={`nature-${idx}`} position={[3, 0.5, -3 + idx * 0.6]} />
            ))}

            {/* Surface-mounted signboard - no Billboard, attached to island */}
            <Signboard 
              position={[2, 0, 1.5]} 
              text={`Day ${plan.day}`}
              subtext={plan.location || plan.stay}
            />
            
            {!hasAirport && (
              <>
                <Rock position={[-3, 0, 3]} />
                <Rock position={[3.5, 0, -2]} />
                <Bush position={[-2.5, 0, -3.5]} />
              </>
            )}
          </group>
        );
      })}
    </>
  );
};

const Map3D: React.FC<Props> = ({ plans, onDayChange, totalPages }) => {
  return (
      <SceneContent plans={plans} onDayChange={onDayChange} totalPages={totalPages} />
  );
};

export default Map3D;
