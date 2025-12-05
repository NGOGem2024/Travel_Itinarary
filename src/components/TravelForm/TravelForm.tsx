import React, { useState } from "react";
import {
  FaBus,
  FaTrain,
  FaPlaneDeparture,
  FaCarSide,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCoins,
} from "react-icons/fa";

import styles from "./TravelForm.module.css";
import { useNavigate } from "react-router-dom";
import type { TravelMode } from "../../types/itinerary";
import { generateItinerary } from "../../services/aiPlanner";

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


interface TravelFormProps {
  onSubmit?: (values: TravelFormValues) => Promise<void>;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit: parentOnSubmit }) => {
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [days, setDays] = useState(3);
  const [travelMode, setTravelMode] = useState<TravelMode>("train");
  const [budget, setBudget] = useState("Moderate");
  const [interests, setInterests] = useState<string[]>([]);
  const [mustVisit, setMustVisit] = useState("");
  const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
  const [loading, setLoading] = useState(false);

  const toggleInterest = (i: string) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i]
    );
  };

  const modeIcons = {
    bus: <FaBus size={24} />,
    train: <FaTrain size={24} />,
    flight: <FaPlaneDeparture size={24} />,
    car: <FaCarSide size={24} />,
  };

  const handleSubmit = async () => {
    if (!from || !to) {
      alert("Please enter start and destination");
      return;
    }

    // setLoading(true);

    try {
      const comfort =
        budget === "Luxury" ? "high" : budget === "Budget" ? "low" : "medium";

      const formData: TravelFormValues = {
        from,
        to,
        days,
        travelMode,
        budget,
        foodPreferences: interests.includes("Food") ? "Yes" : "No",
        mustVisit,
        comfort,
        apiKey,
      };
  // Use parent's onSubmit if provided (Home.tsx controls loading)
      if (parentOnSubmit) {
        await parentOnSubmit(formData);
        return;
      }
       // Standalone mode - handle submission internally
      setLoading(true);
      const itinerary = await generateItinerary(
        from,
        to,
        travelMode,
        days,
        {
          budget,
          foodPreferences: interests.includes("Food") ? "Yes" : "No",
          mustVisit: mustVisit ? [mustVisit] : [],
          comfort,
        },
        apiKey
      );

      navigate("/plan", { state: { formData, itinerary } });
    } catch (error) {
      console.error("Failed to generate itinerary:", error);
      alert("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fullScreenWrapper}>
      <div className={styles.container}>

        {/* LEFT SECTION */}
        <div className={styles.leftSection}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>✈️ AI Powered</div>

            <h1 className={styles.mainHeading}>
              Your Dream <br />
              <span className={styles.gradient}>Adventure</span> <br /> Awaits
            </h1>

            <p className={styles.heroSubtext}>
              Smart itineraries crafted by AI — personalized to your journey.
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            
            <h2 className={styles.heading}>Plan Your Journey</h2>
            <p className={styles.subheading}>Enter details to generate itinerary</p>

            <div className={styles.formBody}>

              {/* FROM + TO */}
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <FaMapMarkerAlt /> Starting Point
                  </label>
                  <input
                    className={styles.input}
                    placeholder="e.g., Mumbai"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <FaMapMarkerAlt /> Destination
                  </label>
                  <input
                    className={styles.input}
                    placeholder="e.g., Paris"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>

              {/* DAYS */}
              <div className={styles.grid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <FaCalendarAlt /> Trip Duration
                  </label>

                  <div className={styles.daysSelector}>
                    <button className={styles.daysBtn} onClick={() => setDays(Math.max(1, days - 1))}>−</button>
                    <div className={styles.daysDisplay}>
                      <span className={styles.daysNumber}>{days}</span>
                      <span>days</span>
                    </div>
                    <button className={styles.daysBtn} onClick={() => setDays(Math.min(30, days + 1))}>+</button>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Adjust Duration</label>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className={styles.brightnessSlider}
                  />
                </div>
              </div>

              {/* TRAVEL MODE */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Preferred Travel Mode</label>

                <div className={styles.modeGrid}>
                  {Object.keys(modeIcons).map((m) => (
                    <div
                      key={m}
                      className={`${styles.modeOption} ${
                        travelMode === m ? styles.modeActive : ""
                      }`}
                      onClick={() => setTravelMode(m as TravelMode)}
                    >
                      {modeIcons[m as keyof typeof modeIcons]}
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BUDGET */}
              <div className={styles.inputGroup}>
                <label className={styles.label}><FaCoins /> Budget Type</label>

                <select
                  className={styles.input}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="Budget">Budget (Backpacker)</option>
                  <option value="Moderate">Moderate (Explorer)</option>
                  <option value="Luxury">Luxury (Royal)</option>
                </select>
              </div>

              {/* MUST VISIT */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Must-Visit Places</label>

                <input
                  className={styles.input}
                  placeholder="e.g., Eiffel Tower, Louvre"
                  value={mustVisit}
                  onChange={(e) => setMustVisit(e.target.value)}
                />
              </div>

              {/* INTERESTS */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Interests</label>

                <div className={styles.interestsGrid}>
                  {["Nature", "History", "Food", "Adventure", "Relaxation", "Culture"].map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={`${styles.interestBtn} ${
                        interests.includes(i) ? styles.active : ""
                      }`}
                      onClick={() => toggleInterest(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className={styles.floatingBtnWrapper}>
            <button 
              className={styles.floatingBtn} 
              onClick={handleSubmit}
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? "Generating Itinerary..." : "Generate My Itinerary"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TravelForm;