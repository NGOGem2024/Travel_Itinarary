import React from "react";
import styles from "./ItineraryLevel.module.css";
import type { DayPlan } from "../../types/itinerary.d";

type Props = {
  plan: DayPlan;
  isComplete?: boolean;
  onToggleComplete?: (day: number) => void;
  containerStyle?: React.CSSProperties;
};

const ItineraryLevel: React.FC<Props> = ({
  plan,
  isComplete = false,
  onToggleComplete,
  containerStyle,
}) => {
  return (
    <div
      className={`${styles.levelCard} ${isComplete ? styles.completed : ""}`}
      style={containerStyle}
    >
      <div className={styles.header}>
        <div className={styles.levelCircle}>Day {plan.day}</div>
        <div className={styles.stay}>{plan.stay.name}</div>

        <button
          aria-label={isComplete ? "Mark incomplete" : "Mark complete"}
          onClick={() => onToggleComplete && onToggleComplete(plan.day)}
          className={styles.completeBtn}
        >
          {isComplete ? "✓" : "○"}
        </button>
      </div>

      <div className={styles.content}>
        {plan.travel && (
          <div className={styles.segment}>
            ↔ {plan.travel.from} → {plan.travel.to} ({plan.travel.mode}) •{" "}
            {plan.travel.duration}
          </div>
        )}

        <div className={styles.section}>
          <strong>Sightseeing</strong>
          <ul>
            {plan.sightseeing.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <strong>Food</strong>
          <ul>
            {plan.food.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className={styles.footer}>
          <div>Daily Budget: ${plan.dailyBudget}</div>
          <div>Stay: ${plan.stay.cost}</div>
        </div>
      </div>

      {isComplete && <div className={styles.completeOverlay}>Completed</div>}
    </div>
  );
};

export default ItineraryLevel;
