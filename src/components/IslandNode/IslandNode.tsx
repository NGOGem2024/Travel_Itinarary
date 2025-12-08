import React from "react";
import styles from "./IslandNode.module.css";
import type { DayPlan } from "../../types/itinerary";

interface Props {
  plan: DayPlan;
  onClick?: () => void;
}

const IslandNode: React.FC<Props> = ({ plan, onClick }) => {
  const biome = plan.biome || 'city';
  const isHotel = biome === 'city' || biome === 'beach'; 

  return (
    <div className={`${styles.nodeWrapper} ${styles[biome]}`} onClick={onClick}>
      <div className={styles.scene}>
        {/* Ground Base */}
        <div className={styles.base}></div>
        
        {/* Parked Vehicle (Visual Only) */}
        <div className={styles.parkedVehicle}></div>

        {/* 3D Building */}
        <div className={`${styles.building} ${isHotel ? styles.hotel : styles.cottage}`}>
          <div className={styles.cube}>
            <div className={`${styles.face} ${styles.front}`}>
               {isHotel ? '🏨' : '🏡'}
            </div>
            <div className={`${styles.face} ${styles.back}`}></div>
            <div className={`${styles.face} ${styles.right}`}></div>
            <div className={`${styles.face} ${styles.left}`}></div>
            <div className={`${styles.face} ${styles.top}`}></div>
            <div className={`${styles.face} ${styles.bottom}`}></div>
          </div>
          {!isHotel && <div className={styles.roof}></div>}
        </div>
      </div>

      {/* Day Label */}
      <div className={styles.dayLabel}>Day {plan.day}</div>

      {/* Info Card (Always Visible) */}
      <div className={styles.infoCard}>
        <h3>{plan.stay}</h3>
        <p>{plan.activities[0]}</p>
        <p style={{marginTop: '4px', color: '#6366f1', fontWeight: 'bold'}}>
          {plan.travels[0]?.split(' ')[0] || 'Travel'}
        </p>
      </div>
    </div>
  );
};

export default IslandNode;
