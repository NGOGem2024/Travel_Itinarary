import React, { useEffect, useRef, useState } from "react";
import styles from "./Plan.module.css";
import type { Itinerary } from "../../types/itinerary.d";
import ItineraryLevel from "../../components/ItineraryLevel/ItineraryLevel";

function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const Plan: React.FC = () => {
  const [plan, setPlan] = useState<Itinerary | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>(
    []
  );

  useEffect(() => {
    const raw = localStorage.getItem("latestItinerary");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Itinerary;
      setPlan(parsed);
      // generate deterministic positions
      const seed = hashString(JSON.stringify(parsed.input));
      const rnd = mulberry32(seed);
      const pts: Array<{ x: number; y: number }> = [];
      const count = parsed.days.length;

      // attempt non-overlapping positions using retries
      for (let i = 0; i < count; i++) {
        let attempts = 0;
        while (attempts < 200) {
          const x = 8 + rnd() * 84; // percent
          const y = 12 + rnd() * 76;
          const tooClose = pts.some((p) => Math.hypot(p.x - x, p.y - y) < 14);
          if (!tooClose) {
            pts.push({ x, y });
            break;
          }
          attempts++;
        }
        if (attempts >= 200)
          pts.push({ x: 10 + i * (80 / count), y: 20 + (i % 3) * 18 });
      }
      setPositions(pts);
    } catch (e) {
      // ignore
    }
  }, []);

  function goHome() {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  // compute pixel positions when container measured
  const [pixelPos, setPixelPos] = useState<Array<{ x: number; y: number }>>([]);
  useEffect(() => {
    if (!containerRef.current || positions.length === 0) return;
    const r = containerRef.current.getBoundingClientRect();
    const px = positions.map((p) => ({
      x: (p.x / 100) * r.width,
      y: (p.y / 100) * r.height,
    }));
    setPixelPos(px);
  }, [positions]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={goHome}>
          &larr; Back
        </button>
        <h2 className={styles.title}>Your Generated Plan</h2>
      </div>

      {!plan && (
        <div className={styles.empty}>
          No plan found. Generate one on the home page.
        </div>
      )}

      {plan && (
        <div className={styles.container} ref={containerRef}>
          <svg className={styles.overlay} width="100%" height="100%">
            <defs>
              <linearGradient id="g2" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#ffd6e8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#c9b8ff" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            {plan.days.map((d, i) => {
              if (!pixelPos[i] || !pixelPos[i + 1]) return null;
              const a = pixelPos[i];
              const b = pixelPos[i + 1];
              // control points with randomness based on day indices
              const seed = hashString(`${i}-${JSON.stringify(plan.input)}`);
              const rnd = mulberry32(seed);
              const dx = (b.x - a.x) * 0.25;
              const dy = (b.y - a.y) * 0.2;
              const cx1 = a.x + dx + (rnd() - 0.5) * 120;
              const cy1 = a.y + dy + (rnd() - 0.5) * 80;
              const cx2 = b.x - dx + (rnd() - 0.5) * 120;
              const cy2 = b.y - dy + (rnd() - 0.5) * 80;
              const dStr = `M ${a.x} ${a.y} C ${cx1} ${cy1} ${cx2} ${cy2} ${b.x} ${b.y}`;
              return (
                <path
                  key={i}
                  d={dStr}
                  stroke="url(#g2)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  fill="none"
                  className={styles.path}
                />
              );
            })}
          </svg>

          {plan.days.map((d, i) => {
            const pos = positions[i];
            const style: React.CSSProperties = pos
              ? {
                  position: "absolute",
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%,-50%)",
                }
              : {};
            return (
              <div key={d.day} className={styles.nodeWrap} style={style}>
                <ItineraryLevel plan={d} containerStyle={{ width: 320 }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Plan;
