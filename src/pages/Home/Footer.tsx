import React from "react";
import Logo from "../../assets/TravelLogo4.png";
import FooterBg from "../../assets/mgg.png"; // <-- ADD YOUR BG IMAGE HERE
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <div
      className="footer-wrapper"
      style={{ backgroundImage: `url(${FooterBg})` }}

    >
      <div className="footer-overlay">
        <div className="footer-section-one">
          <div className="footer-logo-container">
            <img src={Logo} alt="Company Logo" />
          </div>

          <div className="footer-icons">
            <BsTwitter />
            <SiLinkedin />
            <BsYoutube />
            <FaFacebookF />
          </div>
        </div>

        <div className="footer-section-two">
          <div className="footer-section-columns">
            <span>Quality</span>
            <span>Help</span>
            <span>Share</span>
            <span>Careers</span>
            <span>Testimonials</span>
            <span>Work</span>
          </div>

          <div className="footer-section-columns">
            <span>244-5333-7783</span>
            <span>hello@travel.com</span>
            <span>press@travel.com</span>
            <span>contact@travel.com</span>
          </div>

          <div className="footer-section-columns">
            <span>Terms & Conditions</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
