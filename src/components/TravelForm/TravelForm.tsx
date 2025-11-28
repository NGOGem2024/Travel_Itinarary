import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./TravelForm.module.css";
import { FaBus, FaTrain, FaPlaneDeparture, FaCarSide } from "react-icons/fa";
import type { TravelMode } from "../../types/itinerary";

export interface TravelFormValues {
  from: string;
  to: string;
  travelMode: TravelMode;
  days: number;
  budget?: string;
  foodPreferences?: string;
  mustVisit?: string;
  comfort?: "low" | "medium" | "high";
}

interface Props {
  onSubmit(values: TravelFormValues): void;
}

const formVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

const TravelForm: React.FC<Props> = ({ onSubmit }) => {
  const [values, setValues] = useState<TravelFormValues>({
    from: "",
    to: "",
    travelMode: "train",
    days: 3,
    budget: "",
    foodPreferences: "",
    mustVisit: "",
    comfort: "medium",
  });

  const modeIcons: Record<TravelMode, React.ReactNode> = {
    bus: <FaBus />,
    train: <FaTrain />,
    flight: <FaPlaneDeparture />,
    car: <FaCarSide />,
    other: <FaCarSide />,
  };

  return (
    <motion.div
      className={styles.wrapper}
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className={styles.heading}>Plan Your Next Journey</h2>
      <p className={styles.subheading}>Let AI craft your perfect itinerary</p>

      <div className={styles.flowContainer}>
        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>🌍</div>
          <h3>Where are you starting?</h3>
          <input
            required
            placeholder="Enter your starting city"
            value={values.from}
            onChange={(e) => setValues({ ...values, from: e.target.value })}
            className={styles.bigInput}
          />
        </div>

        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>📌</div>
          <h3>Your destination?</h3>
          <input
            required
            placeholder="Enter destination city"
            value={values.to}
            onChange={(e) => setValues({ ...values, to: e.target.value })}
            className={styles.bigInput}
          />
        </div>

        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>🚗</div>
          <h3>How will you travel?</h3>
          <div className={styles.modeGrid}>
            {Object.keys(modeIcons).map((mode) => (
              <div
                key={mode}
                className={`${styles.modeOption} ${
                  values.travelMode === mode ? styles.modeActive : ""
                }`}
                onClick={() =>
                  setValues({ ...values, travelMode: mode as TravelMode })
                }
              >
                {modeIcons[mode as TravelMode]}
                <span>{mode}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>📅</div>
          <h3>Trip Duration</h3>
          <input
            type="number"
            min={1}
            max={30}
            value={values.days}
            onChange={(e) =>
              setValues({ ...values, days: Number(e.target.value) })
            }
            className={styles.bigInput}
          />
        </div>

        <motion.button
          type="button"
          className={styles.nextBtn}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSubmit(values)}
        >
          Generate My Adventure ✨
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TravelForm;
