import React, { useState } from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
  const [message, setMessage] = useState("");

  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=travelovia@gmail.com&su=User Query&body=${encodeURIComponent(
    message
  )}`;

  return (
    <div className={styles.contactPageWrapper}>
      <h1 className={styles.primaryHeading}>Have Question In Mind?</h1>
      <h1 className={styles.primaryHeading}>Let Us Help You</h1>

      <div className={styles.contactFormContainer}>
        <input
          type="text"
          placeholder="Ask your question here..."
          className={styles.inputField}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        
        <a
            href={gmailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
          >
            Submit
        </a>

      </div>
    </div>
  );
};

export default Contact;
