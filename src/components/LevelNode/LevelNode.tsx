import React from "react";
import { motion } from "framer-motion";
import styles from "./LevelNode.module.css";
import type { DayPlan } from "../../types/itinerary";

/*
  LevelNode.tsx
  --------------------------------------------------
  ONE COMPONENT = DOT + CURVE + CARD (ZIGZAG)
  Candy Crush style gamified path
  Z2 Spacing (medium)
  index % 2 == 0 → Card Right
  index % 2 == 1 → Card Left
*/

interface Props {
  plan: DayPlan;
  index: number;
  isLast: boolean;
}

const LevelNode: React.FC<Props> = ({ plan, index, isLast }) => {
  const isLeft = index % 2 === 1;

  return (
    <div className={`${styles.node} ${isLeft ? styles.left : styles.right}`}>
      {/* DOT */}
      <motion.div
        className={styles.dot}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      />

      {/* CURVED CONNECTOR (skip on last) */}
      {!isLast && (
        <svg
          className={styles.curve}
          width="120"
          height="100"
          viewBox="0 0 120 100"
          fill="none"
        >
          {isLeft ? (
            <path
              d="M110 0 C40 40 40 60 110 100"
              stroke="var(--accent-1)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />
          ) : (
            <path
              d="M10 0 C80 40 80 60 10 100"
              stroke="var(--accent-1)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.4"
            />
          )}
        </svg>
      )}

      {/* CARD */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className={styles.day}>
          Day {plan.day}
          {plan.date ? ` • ${plan.date}` : ""}
        </h3>

        <div className={styles.section}>
          <h4>✨ Activities</h4>
          <ul>
            {plan.activities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h4>🚗 Travels</h4>
          <ul>
            {plan.travels.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h4>🍽️ Food</h4>
          <ul>
            {plan.food.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className={styles.meta}>
          <span>🏨 {plan.stay}</span>
          {plan.approximateCost && <span>💰 ₹{plan.approximateCost}</span>}
        </div>
      </motion.div>
    </div>
  );
};

export default LevelNode;
