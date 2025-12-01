import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Land from "./pages/Home/LandingPage";
import TravelForm from "./components/TravelForm/TravelForm";
import Plan from "./pages/Plan/Plan";
import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Land />} />
        <Route path="/travelform" element={<TravelForm />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </div>
  );
};

export default App;
