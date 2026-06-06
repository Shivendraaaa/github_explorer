import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// This is the entry point of the React app. It finds the empty
// <div id="root"> in index.html and renders our App component inside it.
// StrictMode is a development-only wrapper that warns us about common
// mistakes; it adds no extra HTML to the page.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
