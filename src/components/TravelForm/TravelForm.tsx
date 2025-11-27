import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./TravelForm.module.css";
import { FaMapMarkerAlt, FaCalendarAlt, FaCoins, FaUserFriends } from "react-icons/fa";
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
  apiKey?: string;
}

interface Props {
  onSubmit(values: TravelFormValues): void;
}

const TravelForm: React.FC<Props> = ({ onSubmit }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelMode, setTravelMode] = useState<TravelMode>("car");
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState("Moderate");
  const [travelers, setTravelers] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call or processing
    setTimeout(() => {
      setLoading(false);
      onSubmit({
        from: origin,
        to: destination,
        travelMode: travelMode,
        days: days,
        budget: budget,
        foodPreferences: interests.includes("Food") ? "Yes" : "",
        mustVisit: "",
        comfort: budget === "Luxury" ? "high" : budget === "Budget" ? "low" : "medium",
        apiKey: apiKey
      });
    }, 1500);
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className={styles.formContainer}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 variants={itemVariants} className={styles.title}>
        Start Your Quest 🌍
      </motion.h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <motion.div variants={itemVariants} className={styles.inputGroup}>
          <label>Start Location</label>
          <div className={styles.inputWrapper}>
            <FaMapMarkerAlt className={styles.icon} />
            <input
              type="text"
              placeholder="Where are you starting from?"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.inputGroup}>
          <label>Destination</label>
          <div className={styles.inputWrapper}>
            <FaMapMarkerAlt className={styles.icon} />
            <input
              type="text"
              placeholder="Where to, traveler?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.inputGroup}>
          <label>Duration (Days)</label>
          <div className={styles.inputWrapper}>
            <FaCalendarAlt className={styles.icon} />
            <input
              type="number"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.inputGroup}>
          <label>Travel Mode</label>
          <div className={styles.inputWrapper}>
            <FaMapMarkerAlt className={styles.icon} /> {/* Reuse icon or add new one */}
            <select 
              value={travelMode} 
              onChange={(e) => setTravelMode(e.target.value as TravelMode)}
              required
            >
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="flight">Flight</option>
            </select>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.inputGroup}>
          <label>Budget</label>
          <div className={styles.inputWrapper}>
            <FaCoins className={styles.icon} />
            <select value={budget} onChange={(e) => setBudget(e.target.value)} required>
              <option value="Budget">Budget (Backpacker)</option>
              <option value="Moderate">Moderate (Explorer)</option>
              <option value="Luxury">Luxury (Royal)</option>
            </select>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.inputGroup}>
          <label>Travelers</label>
          <div className={styles.inputWrapper}>
            <FaUserFriends className={styles.icon} />
            <input
              type="number"
              min="1"
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={styles.inputGroup}>
          <label>Interests</label>
          <div className={styles.interestsGrid}>
            {['Nature', 'History', 'Food', 'Adventure', 'Relaxation', 'Culture'].map((interest) => (
              <button
                key={interest}
                type="button"
                className={`${styles.interestBtn} ${interests.includes(interest) ? styles.active : ''}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </motion.div>



        <motion.button
          type="submit"
          className={styles.submitBtn}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? "Summoning Itinerary..." : "Launch Adventure 🚀"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TravelForm;
