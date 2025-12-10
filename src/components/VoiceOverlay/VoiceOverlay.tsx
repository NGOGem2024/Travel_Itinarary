import React from "react";
import styles from "./VoiceOverlay.module.css";

interface VoiceOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    transcript: string;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ isOpen, onClose, transcript }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.visualizer}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                </div>

                <h2 className={styles.title}>Listening...</h2>

                <p className={styles.transcript}>
                    {transcript || "Speak now..."}
                </p>

                <button className={styles.closeBtn} onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default VoiceOverlay;
