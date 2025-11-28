import React from "react";
import BannerBackground from "../../assets/home-banner-background.png";
import BannerImage from "../../assets/home-banner-image5.png";
import Navbar from "../Home/Navbar";
import { FiArrowRight } from "react-icons/fi";

import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";
import Gallary from "./Gallary";
import Work from "./Work"
const Land: React.FC = () => {
  return (
    <div className="home-container">
      <Navbar />

      {/* HERO SECTION */}
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="Banner Background" />
        </div>

        <div className="home-text-section">
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

          <button className="secondary-button">
            Start Exploring <FiArrowRight />
          </button>
        </div>

        <div className="home-image-section">
          <img src={BannerImage} alt="Banner" />
        </div>
      </div>

      {/* SCROLL SECTIONS */}
      <section id="about">
        <About />
      </section>

      <section id="work">
        <Work/>
      </section>
      

      <section id="contact">
        <Contact />
      </section>

      <section id="work">
        <Gallary />
      </section>

      <section id="footer">
        <Footer />
      </section>
    </div>
  );
};

export default Land;
