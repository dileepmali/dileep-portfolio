import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";

/*
 * StrictMode is deliberately omitted.
 *
 * It double-invokes effects in development, which for this app means the
 * timeline engine builds, reverts and rebuilds — SplitText re-splits already
 * split markup and Flip measures boxes mid-teardown. The result is a hero that
 * misbehaves only in dev, which is the worst place for a bug to live.
 */
createRoot(document.getElementById("root")).render(<App />);
