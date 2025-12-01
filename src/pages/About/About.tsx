import React from "react";
import AboutBackground from "../../assets/about-background.png";
import AboutBackgroundImage from "../../assets/earthi2.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

import styles from "./About.module.css";

const About: React.FC = () => {
  return (
    <div className={styles.aboutSectionContainer}>
      <div className={styles.aboutBackgroundImageContainer}>
        <img src={AboutBackground} alt="About background" />
      </div>

      <div className={styles.aboutSectionImageContainer}style={{ marginLeft: "80px" }}>
        <img src={AboutBackgroundImage} alt="About section" />
      </div>

      <div className={styles.aboutSectionTextContainer}>
       
        <p className="primary-subheading">About</p>

        <h1 className="primary-heading">How We Are Best For Travel !</h1>

        <p className="primary-text">
          We help travelers discover unforgettable destinations with personalized trip planning, 
  trusted guidance, and seamless booking support.
        </p>

        <p className="primary-text">
          From budget-friendly tours to luxury escapes, our team ensures every journey is safe, 
  smooth, and crafted exactly the way you imagine.
        </p>

        <div className={styles.aboutButtonsContainer}>
          
          <button className="secondary-button">Learn More</button>

          <button className={`${styles.watchVideoButton}`}>
            <BsFillPlayCircleFill /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
