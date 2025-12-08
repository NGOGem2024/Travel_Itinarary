import React, { useState } from "react";
import styles from "./Plan.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { Itinerary } from "../../types/itinerary";
import Experience from "../../components/3D/Experience";
import InfoPanel from "../../components/InfoPanel/InfoPanel";
import RouteVisualizer from "../../components/3D/RouteVisualizer";
import { FaArrowLeft, FaMapMarkedAlt, FaListUl } from "react-icons/fa";

const Plan: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(1);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const itinerary: Itinerary | undefined = state?.itinerary;

  if (!itinerary) {
    navigate("/", { replace: true });
    return null;
  }

  const dayPlans = itinerary.dayPlans;
  const handleDayChange = (day: number) => setCurrentDay(day);

  return (
    <div className={styles.planPage}>
      {/* Back Button */}
      <Link to="/create" className={styles.backButton}>
        <FaArrowLeft /> Back to Form
      </Link>

      {/* View Toggle Button */}
      <div className={styles.viewToggle}>
        <button 
          className={`${styles.toggleBtn} ${viewMode === 'map' ? styles.active : ''}`}
          onClick={() => setViewMode('map')}
        >
          <FaMapMarkedAlt /> Map View
        </button>
        <button 
          className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => setViewMode('list')}
        >
          <FaListUl /> Itinerary
        </button>
      </div>

      {/* Content Area */}
      <div className={styles.contentArea}>
        {viewMode === 'map' ? (
          <div className={styles.fullScreenMap}>
            <RouteVisualizer itinerary={itinerary} />
          </div>
        ) : (
          <>
            <div className={styles.experienceContainer}>
              <Experience 
                plans={dayPlans} 
                itinerary={itinerary} 
                onDayChange={handleDayChange} 
                currentDay={currentDay}
              />
            </div>
            <InfoPanel 
              currentDay={currentDay} 
              dayPlans={dayPlans}
              side={currentDay % 2 !== 0 ? 'left' : 'right'}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Plan;
