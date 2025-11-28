import React from "react";
import LightGallery from "lightgallery/react";
// LightGallery core styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
// Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
// Module CSS
import styles from "../Home/Gallary.module.css";

const GalleryComp: React.FC = () => {
  const onInit = () => {
    console.log("lightGallery has been initialized");
  };

  return (
    <div className="max-w-7xl mx-auto mb-16 px-4 md:px-0 mt-10">
      <div>
        
        
      </div>
      <div className="App">
        <LightGallery
          onInit={onInit}
          speed={500}
          plugins={[lgThumbnail, lgZoom]}
          elementClassNames={styles.lgReactElement}
        >
          <a href="/India.jpg">
            <img className={styles.galleryImage} alt="India" src="/India.jpg" />
          </a>
          <a href="/Hero1.jpg">
            <img
              className={styles.galleryImage}
              alt="Hero 1"
              src="/Hero1.jpg"
            />
          </a>
          <a href="/Hero2.jpg">
            <img
              className={styles.galleryImage}
              alt="Hero 2"
              src="/Hero2.jpg"
            />
          </a>
          <a href="/Hero3.jpg">
            <img
              className={styles.galleryImage}
              alt="Hero 3"
              src="/Hero3.jpg"
            />
          </a>
          <a href="/Hero4.jpg">
            <img
              className={styles.galleryImage}
              alt="Hero 4"
              src="/Hero4.jpg"
            />
          </a>
          <a href="/Bali.jpg">
            <img className={styles.galleryImage} alt="Bali" src="/Bali.jpg" />
          </a>
          <a href="/Venice.jpg">
            <img
              className={styles.galleryImage}
              alt="Venice"
              src="/Venice.jpg"
            />
          </a>
          <a href="/Paris.jpg">
            <img
              className={styles.galleryImage}
              alt="Paris"
              src="/Paris.jpg"
            />
          </a>
          <a href="/Tokyo.jpg">
            <img
              className={styles.galleryImage}
              alt="Tokyo"
              src="/Tokyo.jpg"
            />
          </a>
        </LightGallery>
      </div>
    </div>
  );
};

export default GalleryComp;