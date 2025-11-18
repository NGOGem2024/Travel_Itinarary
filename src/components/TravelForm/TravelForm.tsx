import React, { useState } from "react";
import styles from "./TravelForm.module.css";
import type { ItineraryInput, TravelMode } from "../../types/itinerary.d";

type Props = {
  onSubmit: (input: ItineraryInput) => void;
};

const TravelForm: React.FC<Props> = ({ onSubmit }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState<TravelMode>("flight");
  const [days, setDays] = useState(3);
  const [preferences, setPreferences] = useState("budget: medium; food: local");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ from, to, mode, days, preferences: { raw: preferences } });
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <label>From</label>
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          required
        />
      </div>

      <div className={styles.row}>
        <label>To</label>
        <input value={to} onChange={(e) => setTo(e.target.value)} required />
      </div>

      <div className={styles.row}>
        <label>Travel Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as TravelMode)}
        >
          <option value="flight">Flight</option>
          <option value="train">Train</option>
          <option value="bus">Bus</option>
          <option value="car">Car</option>
        </select>
      </div>

      <div className={styles.row}>
        <label>Number of days</label>
        <input
          type="number"
          min={1}
          max={30}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />
      </div>

      <div className={styles.row}>
        <label>Other preferences</label>
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit}>
          Generate Plan
        </button>
      </div>
    </form>
  );
};

export default TravelForm;
