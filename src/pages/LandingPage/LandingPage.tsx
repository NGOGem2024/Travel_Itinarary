import React from "react";
import BannerBackground from "../../assets/home-banner-background.png";
import BannerImage from "../../assets/home-banner-image5.png";
import Navbar from "./Navbar/Navbar";
import { FiArrowRight } from "react-icons/fi";

import About from "./About/About";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";
import GalleryComp from "./Gallery";
import Work from "./Work";
// import Testimonial from "./Testimonial";
import styles from "./LandingPage.module.css";
import {useNavigate} from "react-router-dom"
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.homeContainer}>
      <Navbar />

      
      <div className={styles.homeBannerContainer}>
        <div className={styles.homeBannerImageContainer}>
          <img src={BannerBackground} alt="Banner Background" />
        </div>

        <div className={styles.homeTextSection}>
          <h1 className="primary-heading">Discover Your Next Adventure</h1>

          <p className="primary-text">Travel Before You Travel</p>

          <p className="primary-text">
            Explore destinations, plan smarter, and experience your journey
            before it begins.
          </p>

          <p className="primary-text">
            Find hidden gems, create personalized itineraries, and make every
            trip unforgettable.
          </p>

          <button
      className="secondary-button"
      onClick={() => navigate("/create")}
    >
      Start Exploring <FiArrowRight />
    </button>
        </div>

        <div className={styles.homeImageSection}>
          <img src={BannerImage} alt="Banner" />
        </div>
      </div>

     
      <section id="about">
        <About />
      </section>

      <section id="work">
        <Work />
      </section>

      {/* <section id="Testimonial">
        <Testimonial />
      </section> */}

      <section id="contact">
        <Contact />
      </section>

      <section id="gallery">
        <GalleryComp />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </div>
  );
};

export default LandingPage;