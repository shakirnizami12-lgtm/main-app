import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const AdsContext = createContext();

export const AdsProvider = ({ children }) => {
  const [ads, setAds] = useState({
    bannerTop: false,
    bannerBottom: false,
    rewardAds: false,
    taskInline: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "ads"), (snap) => {
      if (snap.exists()) {
        setAds(snap.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AdsContext.Provider value={{ ads, loading }}>
      {children}
    </AdsContext.Provider>
  );
};

export const useAds = () => useContext(AdsContext);