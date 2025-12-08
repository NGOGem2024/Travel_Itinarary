import React from 'react';
import styles from './Summary.module.css';
import { FaCoins, FaMapMarkerAlt, FaCalendarAlt, FaPlane } from "react-icons/fa";
import type { Itinerary } from '../../types/itinerary';

interface Props {
  itinerary: Itinerary;
}

const Summary: React.FC<Props> = ({ itinerary }) => {
  const dayPlans = itinerary.dayPlans;
  
  return (
    <section className={styles.summarySection}>
      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>Trip Overview</h2>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <FaMapMarkerAlt className={styles.summaryIcon} />
            <div>
              <div className={styles.summaryLabel}>Destination</div>
              <div className={styles.summaryValue}>{itinerary.destination}</div>
            </div>
          </div>
          <div className={styles.summaryItem}>
            <FaCalendarAlt className={styles.summaryIcon} />
            <div>
              <div className={styles.summaryLabel}>Duration</div>
              <div className={styles.summaryValue}>{itinerary.days} Days</div>
            </div>
          </div>
          <div className={styles.summaryItem}>
            <FaPlane className={styles.summaryIcon} />
            <div>
              <div className={styles.summaryLabel}>Travel Mode</div>
              <div className={styles.summaryValue}>{itinerary.travelMode}</div>
            </div>
          </div>
          <div className={styles.summaryItem}>
            <FaCoins className={styles.summaryIcon} />
            <div>
              <div className={styles.summaryLabel}>Estimated Budget</div>
              <div className={styles.summaryValue}>
                ₹{dayPlans.reduce((sum: number, day) => sum + (day.approximateCost || 0), 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        <p className={styles.summaryDescription}>
          Scroll down to explore your personalized {itinerary.days}-day journey through {itinerary.destination}. 
          Each island represents a day of adventure!
        </p>
      </div>
    </section>
  );
};

export default Summary;
