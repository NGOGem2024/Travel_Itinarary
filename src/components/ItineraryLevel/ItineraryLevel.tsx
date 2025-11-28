import React from "react";
import { motion } from "framer-motion";
import styles from "./ItineraryLevel.module.css";
import type { DayPlan } from "../../types/itinerary";

/*
  FULLY UPDATED BEAUTIFUL DAY-LEVEL COMPONENT
  -----------------------------------------------------
  - Supports: date, travels[], activities[], food[], stay, approximateCost
  - Modern adventure card look
  - Timeline left bar
  - Smooth animations
  - Clean sections
*/

interface Props {
  plan: DayPlan;
}

const ItineraryLevel: React.FC<Props> = ({ plan }) => {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* TIMELINE LEFT SIDE */}
      <div className={styles.timeline}>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.content}>
        <h3 className={styles.dayTitle}>
          Day {plan.day} {plan.date ? `• ${plan.date}` : ""}
        </h3>

        {/* ACTIVITIES */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Activities</h4>
          <ul className={styles.list}>
            {plan.activities.map((act, i) => (
              <li key={i}>✨ {act}</li>
            ))}
          </ul>
        </div>

        {/* TRAVEL SECTION */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Travels</h4>
          <ul className={styles.list}>
            {plan.travels.map(
              (
                t:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      unknown,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined,
                i: React.Key | null | undefined
              ) => (
                <li key={i}>🚗 {t}</li>
              )
            )}
          </ul>
        </div>

        {/* FOOD SECTION */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Food</h4>
          <ul className={styles.list}>
            {plan.food.map((f, i) => (
              <li key={i}>🍽️ {f}</li>
            ))}
          </ul>
        </div>

        {/* META DATA (STAY + COST) */}
        <div className={styles.metaBox}>
          <span>🏨 Stay: {plan.stay}</span>
          {plan.approximateCost && <span>💰 ₹{plan.approximateCost}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryLevel;
