import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [appSettings, setAppSettings] = useState({ maintenanceMode: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching app settings...");
    
    // Safety timeout: force loading to false after 3 seconds
    const timeout = setTimeout(() => {
      console.warn("Settings fetch timed out, forcing loading false");
      setLoading(false);
    }, 3000);

    const unsubApp = onSnapshot(doc(db, "settings", "app"), (doc) => {
      if (doc.exists()) {
        console.log("App settings loaded:", doc.data());
        setAppSettings(doc.data());
      } else {
        console.warn("App settings doc does not exist, using defaults.");
      }
      clearTimeout(timeout);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching app settings:", err);
      clearTimeout(timeout);
      setLoading(false);
    });

    return () => {
      unsubApp();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ appSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
