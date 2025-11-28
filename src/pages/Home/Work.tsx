import React from "react";
import PickMeals from "../../assets/work1.png";
import ChooseMeals from "../../assets/work2.png";
import DeliveryMeals from "../../assets/work3.png";

interface WorkInfo {
  image: string;
  title: string;
  text: string;
}

const Work: React.FC = () => {
  const workInfoData: WorkInfo[] = [
    {
      image: PickMeals,
      title: "Choose Your Destination",
      text: "Search and select from thousands of cities, attractions, and dream travel spots across the world.",
    },
    {
      image: ChooseMeals,
      title: "Plan Your Itinerary",
      text: "Customize your travel days, activities, routes, and experiences with smooth and flexible planning tools.",
    },
    {
      image: DeliveryMeals,
      title: "Start Your Journey",
      text: "Get a complete travel plan and enjoy a seamless, stress-free adventure with your personalized itinerary.",
    },
  ];

  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Travel Itinerary</p>
        <h1 className="primary-heading">How It Works</h1>
        <p className="primary-text">
          Plan your trip in three simple steps—discover destinations, build your
          itinerary, and explore the world with confidence.
        </p>
      </div>

      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt={data.title} />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;