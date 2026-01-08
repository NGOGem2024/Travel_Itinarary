import React from "react";
import styles from "./VoiceOverlay.module.css";

interface VoiceOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    transcript: string;
    error: string | null;
}

const VoiceOverlay: React.FC<VoiceOverlayProps> = ({ isOpen, onClose, transcript, error }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {error ? (
                    <div className={styles.errorState}>
                        <div className={styles.errorIcon}>⚠️</div>
                        <h2 className={styles.errorTitle}>Recognition Issue</h2>
                        <p className={styles.errorMessage}>{error}</p>
                        <button className={styles.closeBtn} onClick={onClose}>
                            Close
                        </button>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default VoiceOverlay;