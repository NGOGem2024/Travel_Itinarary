import React, { useState } from "react";
import {
  FaBus,
  FaTrain,
  FaPlaneDeparture,
  FaCarSide,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import styles from "./TravelForm.module.css";

export interface TravelFormValues {
  from: string;
  to: string;
  travelMode: "bus" | "train" | "flight" | "car";
  days: number;
  budget?: string;
}

interface Props {
  onSubmit(values: TravelFormValues): void;
}

const TravelForm: React.FC<Props> = ({ onSubmit }) => {
  const [values, setValues] = useState<TravelFormValues>({
    from: "",
    to: "",
    travelMode: "train",
    days: 3,
    budget: "",
  });

  const [focusedField, setFocusedField] = useState("");

  const modeIcons = {
    bus: <FaBus size={24} />,
    train: <FaTrain size={24} />,
    flight: <FaPlaneDeparture size={24} />,
    car: <FaCarSide size={24} />,
  };

  return (
    <div className={styles.fullScreenWrapper}>
      <div className={styles.container}>

        {/* LEFT HERO SECTION */}
        <div className={styles.leftSection}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>✈️ AI Powered</div>

            <h1 className={styles.mainHeading}>
              Your Dream <br />
              <span className={styles.gradient}>Adventure</span> <br />
              Awaits
            </h1>

            <p className={styles.heroSubtext}>
              Smart itineraries crafted by AI — personalized to your journey.
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>

            {/* Header */}
            <div className={styles.formHeader}>
              <h2 className={styles.heading}>Plan Your Journey</h2>
              <p className={styles.subheading}>
                Fill in your travel details and let AI create a perfect itinerary
              </p>
            </div>

            {/* Form Body */}
            <div className={styles.formBody}>

              {/* FROM + TO FIELDS */}
              <div className={styles.grid}>
                
                {/* From */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <FaMapMarkerAlt className={styles.labelIcon} />
                    Starting Point
                  </label>

                  <input
                    type="text"
                    placeholder="e.g., Mumbai"
                    value={values.from}
                    onChange={(e) =>
                      setValues({ ...values, from: e.target.value })
                    }
                    onFocus={() => setFocusedField("from")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      focusedField === "from" ? styles.inputFocused : ""
                    }`}
                  />
                </div>

                {/* To */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <FaMapMarkerAlt className={styles.labelIcon} />
                    Destination
                  </label>

                  <input
                    type="text"
                    placeholder="e.g., Paris"
                    value={values.to}
                    onChange={(e) =>
                      setValues({ ...values, to: e.target.value })
                    }
                    onFocus={() => setFocusedField("to")}
                    onBlur={() => setFocusedField("")}
                    className={`${styles.input} ${
                      focusedField === "to" ? styles.inputFocused : ""
                    }`}
                  />
                </div>
              </div>

              {/* DAYS + SLIDER */}
              <div className={styles.grid}>

                {/* Days Selector */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>
                    <FaCalendarAlt className={styles.labelIcon} />
                    Trip Duration
                  </label>

                  <div className={styles.daysSelector}>
                    <button
                      type="button"
                      className={styles.daysBtn}
                      onClick={() =>
                        setValues({
                          ...values,
                          days: Math.max(1, values.days - 1),
                        })
                      }
                    >
                      −
                    </button>

                    <div className={styles.daysDisplay}>
                      <span className={styles.daysNumber}>{values.days}</span>
                      <span className={styles.daysLabel}>days</span>
                    </div>

                    <button
                      type="button"
                      className={styles.daysBtn}
                      onClick={() =>
                        setValues({
                          ...values,
                          days: Math.min(30, values.days + 1),
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Adjust Duration</label>

                  <div className={styles.sliderWrapper}>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={values.days}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          days: Number(e.target.value),
                        })
                      }
                      className={styles.brightnessSlider}
                    />

                    <div className={styles.brightnessValue}>
                      {values.days} days
                    </div>
                  </div>
                </div>
              </div>

              {/* TRAVEL MODE SELECTION */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Preferred Travel Mode</label>

                <div className={styles.modeGrid}>
                  {Object.keys(modeIcons).map((mode) => (
                    <div
                      key={mode}
                      className={`${styles.modeOption} ${
                        values.travelMode === mode ? styles.modeActive : ""
                      }`}
                      onClick={() =>
                        setValues({
                          ...values,
                          travelMode: mode as TravelFormValues["travelMode"],
                        })
                      }
                    >
                      {modeIcons[mode as keyof typeof modeIcons]}
                      <span className={styles.modeLabel}>
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              

            </div> 
            
          </div>
          {/* SUBMIT BUTTON */}
              <div className={styles.floatingBtnWrapper}>
                <button type="button" className={styles.floatingBtn}>
                  Generate My Itinerary
                </button>
              </div>
        </div>

      </div>
    </div>
  );
};

export default TravelForm;
