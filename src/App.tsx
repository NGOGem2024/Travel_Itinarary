import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Plan from "./pages/Plan/Plan";
import Land from "./pages/Home/LandingPage";
import TravelForm, { type TravelFormValues } from "./components/TravelForm/TravelForm"
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
        <Route path="/travelform" element={<TravelForm onSubmit={function (values: TravelFormValues): void {
          throw new Error("Function not implemented.");
        } } />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </div>
  );
};

export default App;
