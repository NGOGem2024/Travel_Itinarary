import React, { useState } from "react";
import AboutBackground from "../../../assets/about-background.png";
import AboutBackgroundImage from "../../../assets/earthi2.png";
import { BsFillPlayCircleFill } from "react-icons/bs";
import styles from "./About.module.css";
import VideoModal from "./VideoModal";
import travelVideo from "../../../assets/traveloviavideo.mp4"; 

const About: React.FC = () => {
  
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  return (
    <>
      <div className={styles.aboutSectionContainer}>
        <div className={styles.aboutBackgroundImageContainer}>
          <img src={AboutBackground} alt="About background" />
        </div>

        <div
          className={styles.aboutSectionImageContainer}
          style={{ marginLeft: "80px" }}
        >
          <img src={AboutBackgroundImage} alt="About section" />
        </div>

        <div className={styles.aboutSectionTextContainer}>
          {/* GLOBAL CSS */}
          <p className="primary-subheading">About</p>

          <h1 className="primary-heading">How We Are Best For Travel !</h1>

          <p className="primary-text">
            Plan your journey effortlessly using voice or manual inputs. Our
            smart system understands your travel needs and transforms them into
            a complete itinerary.
          </p>

          <p className="primary-text">
            From destinations and duration to budget and interests, every detail
            is thoughtfully planned to give you a smooth and enjoyable travel
            experience.
          </p>

          <div className={styles.aboutButtonsContainer}>
            {/* GLOBAL BUTTON */}
            <button
              className="secondary-button"
              onClick={() => {
                const section = document.getElementById("work");
                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              Learn More
            </button>

            <button
              className={`${styles.watchVideoButton}`}
              onClick={openVideoModal}
            >
              <BsFillPlayCircleFill /> Watch Video
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc={travelVideo} // Pass the imported video directly
      />
    </>
  );
};

export default About;