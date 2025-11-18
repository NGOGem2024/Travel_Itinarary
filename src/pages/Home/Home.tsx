import React, { useState } from "react";
import TravelForm from "../../components/TravelForm/TravelForm";
import ItineraryLevel from "../../components/ItineraryLevel/ItineraryLevel";
import LevelPath from "../../components/LevelPath/LevelPath";
import styles from "./Home.module.css";
import { generateItinerary } from "../../services/aiPlanner";
import type { Itinerary, ItineraryInput } from "../../types/itinerary.d";

const Home: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [onboardVisible, setOnboardVisible] = useState(false);

  function keyForInput(input: ItineraryInput) {
    return `travelitinerary:${input.from}:${input.to}:${input.mode}:${input.days}`.toLowerCase();
  }

  async function handleSubmit(input: ItineraryInput) {
    setLoading(true);
    try {
      const result = await generateItinerary(input);
      setItinerary(result);
      // persist latest plan so Plan page can read it
      try {
        localStorage.setItem("latestItinerary", JSON.stringify(result));
      } catch (e) {
        // ignore
      }

      // load persisted progress for this itinerary
      const key = keyForInput(result.input);
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const arr = JSON.parse(saved) as number[];
          setCompleted(new Set(arr));
        } catch (e) {
          setCompleted(new Set());
        }
      } else {
        // first time for this itinerary: show onboarding banner
        const seenKey = `seen:${key}`;
        if (!localStorage.getItem(seenKey)) {
          setOnboardVisible(true);
          setTimeout(() => {
            setOnboardVisible(false);
            localStorage.setItem(seenKey, "1");
          }, 3200);
        }
        setCompleted(new Set());
      }
    } finally {
      setLoading(false);
    }
  }

  // navigate to /plan page
  window.history.pushState({}, "", "/plan");
  window.dispatchEvent(new PopStateEvent("popstate"));

  function persistCompletedForCurrent() {
    if (!itinerary) return;
    const key = keyForInput(itinerary.input);
    localStorage.setItem(key, JSON.stringify(Array.from(completed.values())));
  }

  function toggleComplete(day: number) {
    const next = new Set(completed);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    setCompleted(next);
    // persist
    if (itinerary) {
      const key = keyForInput(itinerary.input);
      localStorage.setItem(key, JSON.stringify(Array.from(next.values())));
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>TravelItinerary — Gamified Planner</h1>

      <div className={styles.main}>
        <div className={styles.left}>
          <TravelForm onSubmit={handleSubmit} />
          {itinerary && (
            <div className={styles.summary}>
              <div>Total budget estimate: ${itinerary.totalBudget}</div>
              <div>Days: {itinerary.days.length}</div>
            </div>
          )}
        </div>

        <div className={styles.right}>
          {!itinerary && !loading && (
            <div className={styles.hint}>
              Fill the form and Generate a plan to see gamified levels.
            </div>
          )}

          {loading && (
            <div className={styles.loading}>Generating your plan...</div>
          )}

          {itinerary && (
            <>
              {onboardVisible && (
                <div className={styles.onboardBanner}>
                  Plan ready! Tap levels to mark progress ✨
                </div>
              )}

              <div className={styles.levelsWrap}>
                <div className={styles.levels}>
                  {itinerary.days.map((d, i) => (
                    <div
                      key={d.day}
                      className={styles.levelItem}
                      style={{ ["--i" as any]: i }}
                    >
                      <ItineraryLevel
                        plan={d}
                        isComplete={completed.has(d.day)}
                        onToggleComplete={toggleComplete}
                      />
                      {i < itinerary.days.length - 1 && (
                        <LevelPath active={completed.has(d.day)} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
