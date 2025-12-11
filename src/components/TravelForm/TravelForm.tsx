import React, { useState } from "react";
import {
  FaBus,
  FaTrain,
  FaPlaneDeparture,
  FaCarSide,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCoins,
  FaMicrophone,
} from "react-icons/fa";

import styles from "./TravelForm.module.css";
import { extractTravelDetails } from "../../services/extractTravelDetails";
import type { TravelMode } from "../../types/itinerary";
import { useNavigate } from "react-router-dom";
import { generateItinerary } from "../../services/aiPlanner";
import GeoapifyAutocomplete from "./GeoapifyAutocomplete";
import VoiceOverlay from "../VoiceOverlay/VoiceOverlay";

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
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

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


  const autoFillForm = (data: any) => {
    console.log("📝 Debug: Applying auto-fill with data:", data);
    if (data.from) setFrom(data.from);
    if (data.to) setTo(data.to);
    if (data.days) setDays(data.days);
    if (data.travelMode) setTravelMode(data.travelMode);
    if (data.budget) setBudget(data.budget);
    if (data.mustVisit) setMustVisit(data.mustVisit);

    if (data.interests) {
      const valid = ["Nature", "History", "Food", "Adventure", "Relaxation", "Culture"];
      setInterests(data.interests.filter((i: string) => valid.includes(i)));
    }
  };

  const startRecording = () => {
    console.log("🎤 Debug: startRecording() triggered");
    setError(null);
    setTranscript("");
    setIsListening(true);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      console.log("🎤 Debug: SpeechRecognition Support =", !!SpeechRecognition);

    if (!SpeechRecognition) {
      setError("Speech Recognition is not supported in this browser.");
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    console.log("🎤 Debug: Recognition initialized, starting...");
    recognition.onstart = () => {
    console.log("🎤 Debug: Listening started...");
  };
    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);

      try {
        console.log("🤖 Debug: Calling extractTravelDetails() with text:", text);
        const details = await extractTravelDetails(text, apiKey);
        autoFillForm(details);
      } catch (err) {
        console.error("Extraction error:", err);
      }
    };

    recognition.onerror = () => {
      setError("Voice recognition failed. Try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    if (!from || !to) {
      setError("Please enter both a starting point and a destination.");
      return;
    }

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

      if (parentOnSubmit) {
        await parentOnSubmit(formData);
        return;
      }

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
      setError("Failed to generate itinerary. Please try again.");
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
            <div className={styles.badge}>🎤 Voice + AI Powered</div>

            <h1 className={styles.mainHeading}>
              Your Dream <br />
              <span className={styles.gradient}>Adventure</span> <br /> Awaits
            </h1>

            <p className={styles.heroSubtext}>
              Speak or type your travel plan — let AI handle the rest.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            
            {!apiKey && (
              <div style={{ marginBottom: 20, padding: 15, background: "#fff3cd", borderRadius: 8, border: "1px solid #ffeeba" }}>
                <p style={{ margin: "0 0 10px 0", color: "#856404", fontSize: "0.9rem" }}>
                  <strong>Missing API Key:</strong> Please enter your Google Gemini API Key below to proceed.
                </p>
                <input
                  type="password"
                  placeholder="Paste AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 className={styles.heading}>Plan Your Journey</h2>

              {/* MIC BUTTON */}
              <button
                className={`${styles.micBtn} ${isListening ? styles.listening : ""}`}
                onClick={startRecording}
                title="Use Voice Input"
              >
                <FaMicrophone color="white" size={18} />
              </button>
            </div>

            <p className={styles.subheading}>
              {isListening ? "Listening..." : "Enter details or tap mic to speak"}
            </p>

            {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

            {/* FROM + TO */}
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}><FaMapMarkerAlt /> Starting Point</label>
                <GeoapifyAutocomplete
                  value={from}
                  onChange={setFrom}
                  placeholder="e.g., Mumbai"
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}><FaMapMarkerAlt /> Destination</label>
                <GeoapifyAutocomplete
                  value={to}
                  onChange={setTo}
                  placeholder="e.g., Paris"
                  className={styles.input}
                />
              </div>
            </div>

            {/* DAYS */}
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}><FaCalendarAlt /> Trip Duration</label>
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

            {/* MODE */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Preferred Travel Mode</label>

              <div className={styles.modeGrid}>
                {Object.keys(modeIcons).map((m) => (
                  <div
                    key={m}
                    className={`${styles.modeOption} ${travelMode === m ? styles.modeActive : ""}`}
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
              <select className={styles.input} value={budget} onChange={(e) => setBudget(e.target.value)}>
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
                placeholder="e.g., Eiffel Tower"
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
                    className={`${styles.interestBtn} ${interests.includes(i) ? styles.active : ""}`}
                    onClick={() => toggleInterest(i)}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className={styles.floatingBtnWrapper}>
            <button
              className={styles.floatingBtn}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Generating Itinerary..." : "Generate My Itinerary"}
            </button>
          </div>
        </div>
      </div>

      {/* Voice Listening Overlay */}
      <VoiceOverlay
        isOpen={isListening}
        onClose={() => setIsListening(false)}
        transcript={transcript}
      />
    </div>
  );
};

export default TravelForm;