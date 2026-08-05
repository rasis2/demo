import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ResumeGenerator from "./ResumeGenerator";

const STORAGE_KEY = "dear-resume-data";

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && typeof d === "object" && d.info) return d;
    }
  } catch (e) {}
  return null;
}

function App() {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    setSaved(loadSaved());
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <ResumeGenerator
      initialData={saved}
      onChange={(data) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
          try {
            const slim = { ...data, info: { ...data.info, photo: null } };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
          } catch (e2) {}
        }
      }}
    />
  );
}

createRoot(document.getElementById("root")).render(<App />);
