import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './InfoPanel.module.css';
import type { DayPlan } from '../../types/itinerary';
import { FaMapMarkerAlt, FaHotel, FaCoins, FaLandmark, FaUtensils, FaCoffee, FaTree, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Props {
  currentDay: number;
  dayPlans: DayPlan[];
  side?: 'left' | 'right';
}

const InfoPanel: React.FC<Props> = ({ currentDay, dayPlans, side = 'right' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const plan = useMemo(() => {
    return dayPlans[currentDay - 1] || dayPlans[0];
  }, [currentDay, dayPlans]);

  if (!plan) return null;

  const weatherIcon = {
    sunny: '☀️',
    cloudy: '☁️',
    'partly cloudy': '⛅',
    rainy: '🌧️',
  }[plan.weather || 'sunny'] || '🌤️';

  return (
    <div className={`${styles.panel} ${side === 'left' ? styles.panelLeft : styles.panelRight} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>Day {plan.day}</h2>
          {!isCollapsed && <span className={styles.weather}>{weatherIcon} {plan.weather || 'Sunny'}</span>}
        </div>
        <button 
          className={styles.collapseButton}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={styles.content}
          >
            <div className={styles.section}>
              <div className={styles.iconRow}>
                <FaMapMarkerAlt className={styles.icon} />
                <span className={styles.location}>{plan.location || 'Unknown'}</span>
              </div>
              <div className={styles.iconRow}>
                <FaHotel className={styles.icon} />
                <span>{plan.stay}</span>
              </div>
            </div>

            {plan.activities && plan.activities.length > 0 && (
              <div className={styles.section}>
                <h3>Activities</h3>
                <ul className={styles.list}>
                  {plan.activities.slice(0, 5).map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>
            )}

            {plan.pois && (
              <div className={styles.section}>
                <h3>Points of Interest</h3>
                <div className={styles.poiGrid}>
                  {plan.pois.tourism && plan.pois.tourism.length > 0 && (
                    <div className={styles.poiCategory}>
                      <FaLandmark className={styles.poiIcon} />
                      <div>
                        <strong>Tourism</strong>
                        <p>{plan.pois.tourism.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {plan.pois.food && plan.pois.food.length > 0 && (
                    <div className={styles.poiCategory}>
                      <FaUtensils className={styles.poiIcon} />
                      <div>
                        <strong>Food</strong>
                        <p>{plan.pois.food.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {plan.pois.cafes && plan.pois.cafes.length > 0 && (
                    <div className={styles.poiCategory}>
                      <FaCoffee className={styles.poiIcon} />
                      <div>
                        <strong>Cafes</strong>
                        <p>{plan.pois.cafes.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  )}
                  {plan.pois.nature && plan.pois.nature.length > 0 && (
                    <div className={styles.poiCategory}>
                      <FaTree className={styles.poiIcon} />
                      <div>
                        <strong>Nature</strong>
                        <p>{plan.pois.nature.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {plan.approximateCost && (
              <div className={styles.footer}>
                <FaCoins className={styles.icon} />
                <span>₹{plan.approximateCost.toLocaleString()}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoPanel;