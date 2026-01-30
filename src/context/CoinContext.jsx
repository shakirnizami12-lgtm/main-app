import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const CoinContext = createContext(null);

export function CoinProvider({ children }) {
  const { user } = useAuth();
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    if (!user) {
      setCoins(0);
      return;
    }

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setCoins(snap.data().coins || 0);
      } else {
        setCoins(0);
      }
    });

    return () => unsub();
  }, [user]);

  return (
    <CoinContext.Provider value={{ coins }}>
      {children}
    </CoinContext.Provider>
  );
}

export function useCoins() {
  const ctx = useContext(CoinContext);
  if (!ctx) {
    throw new Error("useCoins must be used inside CoinProvider");
  }
  return ctx;
}