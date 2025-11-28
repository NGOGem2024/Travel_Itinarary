import React from "react";
import AboutBackground from "../../assets/about-background.png";
import AboutBackgroundImage from "../../assets/earthi2.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About: React.FC = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="About background" />
      </div>

      <div className="about-section-image-container"style={{ marginLeft: "80px" }}>
        <img src={AboutBackgroundImage} alt="About section" />
      </div>

      <div className="about-section-text-container">
        <p className="primary-subheading">About</p>

        <h1 className="primary-heading">
          How We Are Best For Travel !
        </h1>

        <p className="primary-text">
          Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
          elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
        </p>

        <p className="primary-text">
          Non tincidunt magna non et elit. Dolor turpis molestie dui magnis
          facilisis at fringilla quam.
        </p>

        <div className="about-buttons-container">
          <button className="secondary-button">Learn More</button>

          <button className="watch-video-button">
            <BsFillPlayCircleFill size={20} /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
