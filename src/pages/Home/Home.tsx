import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TravelForm, {
  type TravelFormValues,
} from "../../components/TravelForm/TravelForm";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { generateItinerary } from "../../services/aiPlanner";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    console.log("TravelItinerary Version: 2.1 - Debug Mode");
  }, []);

  const apiKeyStatus = import.meta.env.VITE_GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌";

  async function handleSubmit(values: TravelFormValues) {
    setLoading(true);

    const mustVisitArr = values.mustVisit
      ? values.mustVisit
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      : [];

    const data = await generateItinerary(
      values.from,
      values.to,
      values.travelMode,
      values.days,
      {
        budget: values.budget,
        foodPreferences: values.foodPreferences,
        mustVisit: mustVisitArr,
        comfort: values.comfort,
      },
      values.apiKey // Pass API Key
    );

    setLoading(false);

    navigate("/plan", { state: { itinerary: data } });
  }

  return (
    <div className={styles.container}>
      {/* Background Particles/Orbs */}
         {/* Debug Indicator */}
      {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: '#0f0', padding: '5px', borderRadius: '5px', fontSize: '12px', pointerEvents: 'auto', zIndex: 9999 }}>
            v2.1 | API Key: {apiKeyStatus} <br/>
            (If Missing, RESTART 'npm run dev')
         </div>
      </div> */}
      

      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            key="formScreen"
            className={styles.formScreen}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            <TravelForm onSubmit={handleSubmit} />
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            className={styles.loadingScreen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.loader}>
              <span>Crafting Your Legend...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
