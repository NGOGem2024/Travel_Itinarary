import React from "react";
import { motion } from "framer-motion";
import styles from "./LevelPath.module.css";

/*
  LevelPath.tsx
  ------------------------------------------------------
  A BEAUTIFUL, MINIMAL TRAVEL PATH CONNECTOR
  - Animated dots
  - Vertical line
  - Works with ItineraryLevel cards
  - Smooth motion on load
*/

interface Props {
  steps: number; // total number of days
}

const LevelPath: React.FC<Props> = ({ steps }) => {
  return (
    <div className={styles.wrapper}>
      {Array.from({ length: steps }).map((_, i) => (
        <motion.div
          key={i}
          className={styles.item}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className={styles.dot} />
          {i < steps - 1 && <div className={styles.line} />}
        </motion.div>
      ))}
    </div>
  );
};

export default LevelPath;
