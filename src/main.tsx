import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import { Button } from "./components/ui/button";
import { HeroesApp } from "./HeroesApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroesApp />
  </StrictMode>
);
