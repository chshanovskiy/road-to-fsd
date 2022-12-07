import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.effector";
// import { App } from "./App.hooks";
import "./styles.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
