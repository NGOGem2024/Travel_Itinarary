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
  FaKeyboard,
  FaMagic,
  FaBrain,
  FaExchangeAlt,
  FaMapMarker,
} from "react-icons/fa";

import styles from "./TravelForm.module.css";
import { extractTravelDetails } from "../../services/extractTravelDetails";
import type { TravelMode } from "../../types/itinerary";
import { useNavigate } from "react-router-dom";
import { generateItinerary } from "../../services/aiPlanner";
import GeoapifyAutocomplete from "./GeoapifyAutocomplete";
import VoiceOverlay from "../VoiceOverlay/VoiceOverlay";
import { MdAddLocationAlt } from "react-icons/md";
export interface TravelFormValues {
  from: string;
  to: string;
  stops?: string[];
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
  const [stops, setStops] = useState<string[]>([]);

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
  const [activeOption, setActiveOption] = useState<"voice" | "form" | null>(null);

  const isMobile = window.innerWidth <= 768;

  const handleReverseLocations = () => {
  const temp = from;
  setFrom(to);
  setTo(temp);
};
const addStop = () => {
  setStops((prev) => [...prev, ""]);
};

const updateStop = (index: number, value: string) => {
  const updated = [...stops];
  updated[index] = value;
  setStops(updated);
};

const removeStop = (index: number) => {
  setStops((prev) => prev.filter((_, i) => i !== index));
};


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
    setActiveOption("voice");
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

  const handleFocusOnForm = () => {
    setActiveOption("form");
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
        stops,
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
        interests,
        apiKey
      );
      console.log("🧪 DEBUG — Final Form Data Submitted:", {
        from,
        to,
        stops,
        days,
        travelMode,
        budget,
        comfort,
        interests,
        mustVisit,
        apiKeyProvided: !!apiKey
      });

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
            <div className={styles.badge}>🚀 AI Travel Assistant</div>

            <h1 className={styles.mainHeading}>
              Plan Your Perfect <br />
              <span className={styles.getaway}>Getaway</span> <br />
              Your Way
            </h1>

            <p className={styles.heroSubtext}>
              Choose how you want to plan - speak naturally or fill in details. 
              Our AI understands both and creates personalized itineraries instantly.
            </p>

            {/* Interactive Options Cards */}
            <div className={styles.optionHighlights}>
              <div 
                className={styles.optionCard}
                onClick={startRecording}
                onMouseEnter={() => setActiveOption("voice")}
                onMouseLeave={() => setActiveOption(null)}
                style={{
                  borderColor: activeOption === "voice" ? "#fe9e0d" : undefined,
                  transform: activeOption === "voice" ? "translateY(-8px)" : undefined
                }}
              >
                <div className={styles.optionIcon}>
                  <FaMicrophone />
                </div>
                <h3 className={styles.optionTitle}>Speak Your Plan</h3>
                <p className={styles.optionDesc}>
                  "I want to go from Delhi to Goa for 5 days with adventure activities"
                </p>
              </div>

              <div 
                className={styles.optionCard}
                onClick={handleFocusOnForm}
                onMouseEnter={() => setActiveOption("form")}
                onMouseLeave={() => setActiveOption(null)}
                style={{
                  borderColor: activeOption === "form" ? "#fe9e0d" : undefined,
                  transform: activeOption === "form" ? "translateY(-8px)" : undefined
                }}
              >
                <div className={styles.optionIcon}>
                  <FaKeyboard />
                </div>
                <h3 className={styles.optionTitle}>Fill Details</h3>
                <p className={styles.optionDesc}>
                  Prefer traditional form? Fill in specific preferences and get precise results
                </p>
              </div>
            </div>

            {/* Feature Highlight */}
            <div className={styles.choiceTag}>
              <FaMagic /> 
              <span>Pro Tip:</span> Start with voice for quick setup, then refine with form details
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Form */}
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

            <div className={styles.headerRow}>
              <h2 className={styles.heading}>
                Plan Your Journey
              </h2>

              <div className={styles.voiceHint}>
                <span className={styles.hintText}>
                  {isListening ? "Listening... Speak now!" : "Tap Mic to Speak"}
                </span>

                <button
                  className={`${styles.micBtn} ${isListening ? styles.listening : ""}`}
                  onClick={startRecording}
                  title="Speak your travel plan"
                >
                  <FaMicrophone color="white" size={20} />
                </button>
              </div>
            </div>

            {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

            {/* Voice Active Indicator */}
            {isListening && (
              <div className={styles.voiceActive}>
                <FaBrain style={{ marginRight: '10px', color: '#fe9e0d' }} />
                <strong>Listening...</strong> Speak your travel plan clearly. Example: 
                "I want to go from Mumbai to Paris for 7 days with luxury budget"
              </div>
            )} 
            <div className={styles.routeWrapper}>
              <div className={styles.locationGrid}>
                <div className={styles.inputGroup}>
                  <div className={styles.labelRow}>
                  <label className={styles.sdlabel}>
                    <FaMapMarkerAlt /> Starting Point
                  </label>
                  </div>
                  <GeoapifyAutocomplete
                    value={from}
                    onChange={setFrom}
                    placeholder={isMobile ? "Choose start location" : "e.g., Mumbai"}
                    className={`${styles.input} ${styles.compactInput}`}
                  />
                  
                  <div className={`${styles.addStopRow} ${styles.decorative}`}>
  
                </div>
              </div>

                <button
                  type="button"
                  className={styles.reverseBtn}
                  onClick={handleReverseLocations}
                  disabled={!from || !to}
                  title="Reverse starting point and destination"
                >
                  <FaExchangeAlt size={16} />
                </button>
              
              <div className={styles.dottedLine}>
                <button
                type="button"
                className={styles.addStop}
                disabled={!from || !to}
                onClick={addStop}
                title="Please enter both the starting point and destination to add stops"
              >
              <MdAddLocationAlt />
              </button></div>
                <div className={styles.inputGroup}>
                  <div className={styles.labelRow}>
                  <label className={styles.sdlabel}>
                    <FaMapMarkerAlt /> Destination
                  </label>
                  </div>
                  <GeoapifyAutocomplete
                    value={to}
                    onChange={setTo}
                    placeholder={isMobile ? "Choose desination " : "e.g., Paris"}
                    className={`${styles.input} ${styles.compactInput}`}
                  />
                </div>
              </div> 
            </div>

            {/* <div className={styles.stopsSection}>
              {stops.map((stop, index) => (
                <div key={index} className={styles.stopRow}>
                  <GeoapifyAutocomplete
                    value={stop}
                    onChange={(val) => updateStop(index, val)}
                    placeholder={`Stop ${index + 1}`}
                    className={styles.input}
                  />

                  <button
                    type="button"
                    className={styles.removeStopBtn}
                    onClick={() => removeStop(index)}
                    title="Remove stop"
                  >
                    ✕
                  </button>
                </div>
              ))}

            </div> */}
            {from && to && stops.length > 0 && (
              <div className={`${styles.routeDisplayHorizontal} ${stops.length > 2 ? styles.scrollable : ''}`}>
                {/* SOURCE */}
                  <div className={`${styles.locationPoint} ${styles.source}`}>
                  <FaMapMarkerAlt size={16}/>
                  
              </div>

    <span className={styles.arrowSeparator}>→</span>

    {/* STOPS */}
    {stops.map((stop, index) => (
      <div key={index} className={styles.stopItemHorizontal}>
        {/* <FaFlag className={styles.icon} /> */}
        <span className={styles.stopNumber}>{index + 1}</span>
        <input
          
          value={stop}
          onChange={(e) => updateStop(index, e.target.value)}
          placeholder="Stop"
          className={styles.stopInputHorizontal}
        />
        <button
          onClick={() => removeStop(index)}
          className={styles.removeStopBtnHorizontal}
          title="Remove stop"
        >
          ✕
        </button>
      </div>
    ))}

    <span className={styles.arrowSeparator}>→</span>

    {/* DESTINATION */}
    <div className={`${styles.locationPoint} ${styles.destination}`}>
      <FaMapMarker size={16}/>
      
    </div>
  </div>
)}
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
                {/* PREDEFINED INTERESTS */}
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

                {/* CUSTOM INTERESTS DISPLAY */}
                {interests
                  .filter((i) => !["Nature", "History", "Food", "Adventure", "Relaxation", "Culture", "Other"].includes(i))
                  .map((custom) => (
                    <button
                      key={custom}
                      type="button"
                      className={`${styles.interestBtn} ${styles.active}`}
                      onClick={() => toggleInterest(custom)}
                    >
                      {custom} ✕
                    </button>
                  ))}

                {/* OTHER OPTION */}
                {!interests.some((i) => i === "Other") && (
                  <button
                    type="button"
                    className={`${styles.interestBtn}`}
                    onClick={() => setInterests((prev) => [...prev, "Other"])}
                  >
                    Other +
                  </button>
                )}
              </div>

              {interests.includes("Other") && (
                <div className={styles.customInterestContainer}>
                  <input
                    className={styles.customInterestInput}
                    id="customInterest"
                    placeholder="Enter your custom interest..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = (e.currentTarget as HTMLInputElement).value.trim();
                        if (!value) return;

                        setInterests((prev) => [
                          ...prev.filter((v) => v !== "Other"),
                          value,
                        ]);

                        (e.currentTarget as HTMLInputElement).value = "";
                      }
                    }}
                  />
                  <button
                    className={styles.addInterestBtn}
                    onClick={() => {
                      const input = document.getElementById("customInterest") as HTMLInputElement;
                      const value = input.value.trim();
                      if (!value) return;

                      setInterests((prev) => [
                        ...prev.filter((v) => v !== "Other"),
                        value,
                      ]);

                      input.value = "";
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
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
              {loading ? "🎯 Crafting Your Perfect Plan..." : "Generate My Dream Itinerary"}
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