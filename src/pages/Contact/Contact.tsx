import React from "react";
import styles from "./Contact.module.css";

const Contact: React.FC = () => {
  return (
    <div className={styles.contactPageWrapper}>
      <h1 className={styles.primaryHeading}>Have Question In Mind?</h1>
      <h1 className={styles.primaryHeading}>Let Us Help You</h1>

      <div className={styles.contactFormContainer}>
        <input
          type="email"
          placeholder="yourmail@gmail.com"
          className={styles.inputField}
        />

        <button className="secondary-button">Submit</button>

      </div>
    </div>
  );
};

export default Contact;
