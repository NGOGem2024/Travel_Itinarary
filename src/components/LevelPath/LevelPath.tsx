import React from "react";
import styles from "./LevelPath.module.css";

type Props = {
  // whether the connector should display as active/filled
  active?: boolean;
};

const LevelPath: React.FC<Props> = ({ active = false }) => {
  // A curved SVG segment to sit between two level cards
  return (
    <div className={styles.path}>
      <svg
        className={styles.svg}
        width="140"
        height="72"
        viewBox="0 0 140 72"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#ffd6e8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#c9b8ff" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path
          d="M6,60 C48,10 92,10 134,60"
          fill="none"
          stroke="url(#g1)"
          strokeWidth="6"
          strokeLinecap="round"
          className={active ? styles.pathActive : styles.pathInactive}
        />
        {active && (
          <circle cx="6" cy="60" r="8" className={styles.nodeActive} />
        )}
      </svg>
    </div>
  );
};

export default LevelPath;
