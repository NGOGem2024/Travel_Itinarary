import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Plan from "./pages/Plan/Plan";
import Land from "./pages/Home/LandingPage";

// global CSS
import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Land />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </div>
  );
};

export default App;
