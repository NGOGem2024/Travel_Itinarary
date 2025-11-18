import React, { useEffect, useState } from "react";
import Home from "./pages/Home/Home";
import Plan from "./pages/Plan/Plan";
import "./App.css";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (path !== "/" && path !== "/plan") {
      window.history.replaceState({}, "", "/");
      setPath("/");
    }
  }, [path]);

  return (
    <div className="app-root">
      {path === "/" && <Home />}
      {path === "/plan" && <Plan />}
    </div>
  );
}

export default App;
