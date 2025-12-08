import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Plan from "./pages/Plan/Plan";

import "./App.css";
import TravelForm from "./components/TravelForm/TravelForm";
import LandingPage from "./pages/LandingPage/LandingPage";
// import TravelForm from "./components/TravelForm/TravelForm";

const App: React.FC = () => {
  useEffect(() => {
    scrollTo(0, 0);
  }, []);
  return (
    <div className="app-root">
      <Routes>
        {/* <Route path="/" element={<TravelForm/>} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<Home />} />
         {/* <Route path="/travelform" element={<TravelForm onSubmit={function (values: TravelFormValues): void {
          throw new Error("Function not implemented.");
        } } />} /> */}
        <Route path="/travelform" element={<TravelForm />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </div>
  );
};

export default App;
