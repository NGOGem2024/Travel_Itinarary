import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TravelForm, {
  type TravelFormValues,
} from "../../components/TravelForm/TravelForm";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import { generateItinerary } from "../../services/aiPlanner";

/*
  CLEAN REWRITTEN HOME PAGE WITH ROUTING
  ----------------------------------------------
  1) Shows TravelForm on first load
  2) On submit → navigate("/plan") and pass itinerary
  3) Home no longer renders the plan inside
*/

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      }
    );

    setLoading(false);

    navigate("/plan", { state: { itinerary: data } });
  }

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            key="formScreen"
            className={styles.formScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
            <div className={styles.loader}>✨ Crafting your adventure...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
