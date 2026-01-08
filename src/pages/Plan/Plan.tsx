import React, { useState } from "react";
import styles from "./Plan.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { Itinerary } from "../../types/itinerary";
import Experience from "../../components/3D/Experience";
// import InfoPanel from "../../components/InfoPanel/InfoPanel";
import RouteVisualizer from "../../components/3D/RouteVisualizer";
import { FaArrowLeft, FaMapMarkedAlt, FaListUl } from "react-icons/fa";
import Logo from "../../assets/croppedtravloviatrans.png";

const Plan: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentItinerary, setCurrentItinerary] = useState<Itinerary | undefined>(state?.itinerary);
  const [currentDay, setCurrentDay] = useState(1);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  if (!currentItinerary) {
    navigate("/", { replace: true });
    return null;
  }

  const dayPlans = currentItinerary.dayPlans;
  const handleDayChange = (day: number) => setCurrentDay(day);

  const handleHotelChange = (day: number, hotel: import("../../types/itinerary").HotelOption) => {
    if (!currentItinerary) return;

    const newDayPlans = currentItinerary.dayPlans.map(plan => {
      if (plan.day === day) {
        return {
          ...plan,
          stay: hotel.name,
          coordinates: hotel.coordinates || plan.coordinates // Update coordinates if available
        };
      }
      return plan;
    });

    setCurrentItinerary({
      ...currentItinerary,
      dayPlans: newDayPlans
    });
  };

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
            <RouteVisualizer 
              itinerary={currentItinerary} 
              onHotelSelect={handleHotelChange}
            />
          </div>
        ) : (
          <>
            <div className={styles.experienceContainer}>
              <Experience 
                plans={dayPlans} 
                itinerary={currentItinerary} 
                onDayChange={handleDayChange} 
                currentDay={currentDay}
              />
            </div>
            {/* <InfoPanel 
              currentDay={currentDay} 
              dayPlans={dayPlans}
              side={currentDay % 2 !== 0 ? 'left' : 'right'}
              onHotelChange={handleHotelChange}
            /> */}
          </>
        )}
      </div>

      {/* Logo in left bottom corner */}
      <div className={styles.logoContainer}>
        <img src={Logo} alt="Travlovia Logo" className={styles.logo} />
      </div>
    </div>
  );
};

export default Plan;
