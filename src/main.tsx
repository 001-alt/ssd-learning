import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LearningProvider } from "./state/LearningContext";
import App from "./App";
import "./styles.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LearningProvider>
        <App />
      </LearningProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
