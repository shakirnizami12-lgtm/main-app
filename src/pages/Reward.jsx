import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useCoins } from "../context/CoinContext";

export default function Reward() {
  const { user } = useAuth();
  const { coins, refreshCoins } = useCoins();

  const [rewardPerAd, setRewardPerAd] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [enabled, setEnabled] = useState(false);

  const [todayAds, setTodayAds] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [loading, setLoading] = useState(true);

  const TODAY = new Date().toISOString().slice(0, 10);

  /* 🔹 Load admin settings */
  useEffect(() => {
    const loadSettings = async () => {
      const snap = await getDoc(doc(db, "settings", "reward_ads"));
      if (snap.exists()) {
        const d = snap.data();
        setRewardPerAd(d.rewardPerAd || 0);
        setDailyLimit(d.dailyLimit || 0);
        setEnabled(d.enabled || false);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  /* 🔹 Load user ad stats */
  useEffect(() => {
    const loadUserStats = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) return;

      const d = snap.data();
      if (d.rewardAdsDate === TODAY) {
        setTodayAds(d.rewardAdsToday || 0);
      } else {
        setTodayAds(0);
      }
    };

    loadUserStats();
  }, [user]);

  /* ⏱️ Timer logic */
  useEffect(() => {
    if (!isWatching) return;

    if (timeLeft === 0) {
      completeAd();
      return;
    }

    const t = setTimeout(() => {
      setTimeLeft((p) => p - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [isWatching, timeLeft]);

  /* ▶ Start Ad */
  const startAd = async () => {
    if (!enabled) return alert("Ads disabled by admin");
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const d = snap.data();
    const lastDate = d.rewardAdsDate;
    const adsToday = lastDate === TODAY ? d.rewardAdsToday || 0 : 0;

    if (adsToday >= dailyLimit) {
      alert("Daily ad limit reached");
      return;
    }

    // 🛑 BOT / FAST CLICK PROTECTION (30 sec gap)
    const lastAdAt = d.lastAdAt?.toMillis?.() || 0;
    const now = Date.now();

    if (now - lastAdAt < 30000) {
      alert("Please wait before next ad");
      return;
    }

    setIsWatching(true);
    setTimeLeft(15);
  };

  /* ✅ Complete Ad */
  const completeAd = async () => {
    setIsWatching(false);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const d = snap.data();
    const adsToday = d.rewardAdsDate === TODAY ? d.rewardAdsToday || 0 : 0;

    await updateDoc(userRef, {
      coins: increment(rewardPerAd),
      rewardAdsToday: adsToday + 1,
      rewardAdsDate: TODAY,
      lastAdAt: serverTimestamp(),
    });

    setTodayAds(adsToday + 1);
    refreshCoins();
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "auto" }}>
      <h2 style={{ marginBottom: 10 }}>🎬 Reward Ads</h2>

      {/* Stats */}
      <div style={card}>
        <p>💰 <b>Total Coins:</b> {coins}</p>
        <p>📊 <b>Today Ads:</b> {todayAds}/{dailyLimit}</p>
      </div>

      {/* Reward Info */}
      <div style={rewardBox}>
        🎁 Earn <b>{rewardPerAd} coins</b> per ad
      </div>

      {/* Action Button */}
      {!isWatching ? (
        <button
          onClick={startAd}
          disabled={!enabled}
          style={{
            ...btn,
            background: enabled ? "#2563eb" : "#9ca3af",
          }}
        >
          ▶ Watch Ad & Earn {rewardPerAd} Coins
        </button>
      ) : (
        <button disabled style={{ ...btn, background: "#f59e0b" }}>
          ⏳ Watching Ad... {timeLeft}s
        </button>
      )}
    </div>
  );
}

/* ===== Styles ===== */
const card = {
  background: "#f1f5f9",
  padding: 12,
  borderRadius: 10,
  marginBottom: 12,
};

const rewardBox = {
  background: "#ecfdf5",
  color: "#065f46",
  padding: 12,
  borderRadius: 10,
  fontWeight: "bold",
  marginBottom: 16,
  textAlign: "center",
};

const btn = {
  width: "100%",
  padding: "12px",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontSize: 16,
  cursor: "pointer",
};