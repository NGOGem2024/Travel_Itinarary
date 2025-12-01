import React from "react";
import LightGallery from "lightgallery/react";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

import styles from "../Home/Gallary.module.css";

// ---------- IMPORT IMAGES FROM ASSETS ----------
import IndiaImg from "../../assets/India.jpg";
import Hero1Img from "../../assets/Hero1.jpg";
import Hero2Img from "../../assets/Hero2.jpg";
import Hero3Img from "../../assets/Hero3.jpg";
import Hero4Img from "../../assets/Hero4.jpg";
import BaliImg from "../../assets/Bali.jpg";
import VeniceImg from "../../assets/Venice.jpg";
import ParisImg from "../../assets/Paris.jpg";
import TokyoImg from "../../assets/Tokyo.jpg";
// ------------------------------------------------

const GalleryComp: React.FC = () => {
  const onInit = () => {
    console.log("lightGallery has been initialized");
  };

  return (
    <div className="max-w-7xl mx-auto mb-16 px-4 md:px-0 mt-10">
      <div className="App">
        <LightGallery
          onInit={onInit}
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          elementClassNames={styles.lgReactElement}
        >
          <a href={IndiaImg}>
            <img className={styles.galleryImage} alt="India" src={IndiaImg} />
          </a>

          <a href={Hero1Img}>
            <img className={styles.galleryImage} alt="Hero 1" src={Hero1Img} />
          </a>

          <a href={Hero2Img}>
            <img className={styles.galleryImage} alt="Hero 2" src={Hero2Img} />
          </a>

          <a href={Hero3Img}>
            <img className={styles.galleryImage} alt="Hero 3" src={Hero3Img} />
          </a>

          <a href={Hero4Img}>
            <img className={styles.galleryImage} alt="Hero 4" src={Hero4Img} />
          </a>

          <a href={BaliImg}>
            <img className={styles.galleryImage} alt="Bali" src={BaliImg} />
          </a>

          <a href={VeniceImg}>
            <img className={styles.galleryImage} alt="Venice" src={VeniceImg} />
          </a>

          <a href={ParisImg}>
            <img className={styles.galleryImage} alt="Paris" src={ParisImg} />
          </a>

          <a href={TokyoImg}>
            <img className={styles.galleryImage} alt="Tokyo" src={TokyoImg} />
          </a>
        </LightGallery>
      </div>
    </div>
  );
};

export default GalleryComp;
