import React from "react";
import ProfilePic from "../../assets/john-doe-image.png";
import { AiFillStar } from "react-icons/ai";
import styles from "./Testimonial.module.css";

const Testimonial: React.FC = () => {
  return (
    <div className={styles.workSectionWrapper}>
      <div className={styles.workSectionTop}>
        <p className={styles.primarySubheading}>Testimonial</p>
        <h1 className={styles.primaryHeading}>What They Are Saying</h1>
        <p className={styles.primaryText}>
          Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
          elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
        </p>
      </div>

      <div className={styles.testimonialSectionBottom}>
        <img src={ProfilePic} alt="Customer" />

        <p>
          Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
          elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
        </p>

        <div className={styles.testimonialsStarsContainer}>
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>

        <h2>John Doe</h2>
      </div>
    </div>
  );
};

export default Testimonial;
