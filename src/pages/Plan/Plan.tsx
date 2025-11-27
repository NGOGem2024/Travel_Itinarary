import React, { useState } from "react";
import styles from "./Plan.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { Itinerary } from "../../types/itinerary";
import Experience from "../../components/3D/Experience";
import InfoPanel from "../../components/InfoPanel/InfoPanel";
import { FaArrowLeft } from "react-icons/fa";

const Plan: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(1);
  const itinerary: Itinerary | undefined = state?.itinerary;

  if (!itinerary) {
    navigate("/", { replace: true });
    return null;
  }

  const dayPlans = itinerary.dayPlans;
  const handleDayChange = (day: number) => setCurrentDay(day);

  return (
    <div className={styles.planPage}>
      {/* Back Button - Floating */}
      <Link to="/" className={styles.backButton}>
        <FaArrowLeft /> Back to Home
      </Link>

      <div className={styles.experienceContainer}>
        <Experience plans={dayPlans} itinerary={itinerary} onDayChange={handleDayChange} />
      </div>

      <InfoPanel 
        currentDay={currentDay} 
        dayPlans={dayPlans}
        side={currentDay % 2 !== 0 ? 'left' : 'right'}
      />
    </div>
  );
};

export default Plan;
