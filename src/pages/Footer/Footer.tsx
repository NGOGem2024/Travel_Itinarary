import React from "react";
import Logo from "../../assets/TravelLogo4.png";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import styles from "../Footer/Footer.module.css";

const Footer: React.FC = () => {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.footerSectionOne}>
        <div className={styles.footerLogoContainer}>
          <img src={Logo} alt="Logo" />
        </div>

        <div className={styles.footerIcons}>
          <BsTwitter />
          <SiLinkedin />
          <BsYoutube />
          <FaFacebookF />
        </div>
      </div>

      <div className={styles.footerSectionTwo}>
        <div className={styles.footerSectionColumns}>
          <span>Quality</span>
          <span>Help</span>
          <span>Share</span>
          <span>Careers</span>
          <span>Testimonials</span>
          <span>Work</span>
        </div>

        <div className={styles.footerSectionColumns}>
          <span>244-5333-7783</span>
          <span>hello@travel.com</span>
          <span>press@travel.com</span>
          <span>contact@travel.com</span>
        </div>

        <div className={styles.footerSectionColumns}>
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
