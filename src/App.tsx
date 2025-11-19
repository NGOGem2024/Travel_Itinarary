import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Plan from "./pages/Plan/Plan";
import "./App.css";
// import TravelForm from "./components/TravelForm/TravelForm";

const App: React.FC = () => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  return (
    <div className="app-root">
      <Routes>
        {/* <Route path="/" element={<TravelForm/>} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </div>
  );
};

export default App;
