import React from "react";
import { motion } from "framer-motion";
import styles from "./Plan.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import type { Itinerary } from "../../types/itinerary";
import LevelNode from "../../components/LevelNode/LevelNode";

/*
  Plan.tsx — NEW ZIGZAG CANDY-CRUSH LAYOUT
  ----------------------------------------------
  Uses LevelNode (dot + curve + card bundle)
  Completely replaces old LevelPath + ItineraryLevel layout
*/

const Plan: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const itinerary: Itinerary | undefined = state?.itinerary;

  if (!itinerary) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={styles.header}>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Your Travel Path ✨
        </motion.h1>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {itinerary.from} → {itinerary.to} • {itinerary.days} Days
        </motion.p>

        <div className={styles.summaryBox}>
          💰 Estimated Total: ₹{itinerary.totalEstimatedCost}
        </div>
      </header>

      {/* Zigzag LevelNode Rendering */}
      <div className={styles.zigzagList}>
        {itinerary.dayPlans.map((plan, i) => (
          <LevelNode
            key={plan.day}
            plan={plan}
            index={i}
            isLast={i === itinerary.dayPlans.length - 1}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Plan;
