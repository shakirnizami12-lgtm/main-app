import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function NumberGuessPage() {
  const { user } = useAuth();

  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null); // win | lose
  const [randomNumber, setRandomNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [todayCount, setTodayCount] = useState(0);

  const DAILY_LIMIT = 10;
  const REWARD_COINS = 5;
  const COOLDOWN_SECONDS = 30;

  /* 🔹 LOAD USER GAME DATA */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setTodayCount(data.todayGuessCount || 0);

        if (data.lastGuessTime) {
          const diff =
            COOLDOWN_SECONDS -
            Math.floor(
              (Date.now() - data.lastGuessTime.toMillis()) / 1000
            );
          if (diff > 0) setCooldown(diff);
        }
      }
    };

    load();
  }, [user]);

  /* 🔹 COOLDOWN TIMER */
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  /* 🔹 GUESS CLICK */
  const handleGuess = async (num) => {
    if (!user) return alert("Login required");
    if (loading) return;
    if (todayCount >= DAILY_LIMIT)
      return alert("❌ Daily limit reached");
    if (cooldown > 0)
      return alert(`⏳ Wait ${cooldown}s before next try`);

    setLoading(true);
    setSelected(num);

    const rand = Math.floor(Math.random() * 5) + 1;
    setRandomNumber(rand);

    const win = num === rand;
    setResult(win ? "win" : "lose");

    const ref = doc(db, "users", user.uid);

    await updateDoc(ref, {
      todayGuessCount: todayCount + 1,
      lastGuessTime: serverTimestamp(),
    });

    setCooldown(COOLDOWN_SECONDS);
    setTodayCount((c) => c + 1);
    setLoading(false);
  };

  /* 🔹 CLAIM REWARD (Rewarded Ad) */
  const claimReward = async () => {
    if (!user) return;

    // 👉 YAHAN Rewarded Ad show karna hai
    // showRewardedAd().then(() => {})

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    await updateDoc(ref, {
      coins: (snap.data().coins || 0) + REWARD_COINS,
    });

    alert(`🎉 +${REWARD_COINS} coins added`);
    resetGame();
  };

  /* 🔹 RETRY (Interstitial Ad) */
  const retry = () => {
    // 👉 YAHAN Interstitial Ad show karna hai
    // showInterstitialAd()
    resetGame();
  };

  const resetGame = () => {
    setSelected(null);
    setResult(null);
    setRandomNumber(null);
  };

  return (
    <div style={page}>
      <h2 style={title}>🎯 Number Guess</h2>

      <p style={sub}>
        Guess a number between <b>1 – 5</b>
      </p>

      <div style={grid}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            disabled={selected !== null}
            onClick={() => handleGuess(n)}
            style={{
              ...btn,
              background:
                selected === n
                  ? result === "win"
                    ? "#22c55e"
                    : "#ef4444"
                  : "#1e293b",
            }}
          >
            {n}
          </button>
        ))}
      </div>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: 20 }}>
          {result === "win" ? (
            <>
              <h3 style={{ color: "#22c55e" }}>🎉 Correct Guess!</h3>
              <button style={rewardBtn} onClick={claimReward}>
                🎁 Claim Reward (+{REWARD_COINS})
              </button>
            </>
          ) : (
            <>
              <h3 style={{ color: "#ef4444" }}>❌ Wrong Guess</h3>
              <p>Correct number was: {randomNumber}</p>
              <button style={retryBtn} onClick={retry}>
                🔁 Retry (Watch Ad)
              </button>
            </>
          )}
        </div>
      )}

      <div style={info}>
        <div>Attempts today: {todayCount}/{DAILY_LIMIT}</div>
        {cooldown > 0 && <div>⏳ Cooldown: {cooldown}s</div>}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 20,
  minHeight: "100vh",
  background: "#020617",
  color: "#fff",
  textAlign: "center",
};

const title = { fontSize: 24, fontWeight: 900 };

const sub = { color: "#94a3b8", marginBottom: 20 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 12,
};

const btn = {
  padding: "18px 0",
  borderRadius: 16,
  fontSize: 20,
  fontWeight: 800,
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const rewardBtn = {
  marginTop: 12,
  padding: 14,
  width: "100%",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg,#22c55e,#16a34a)",
  color: "#fff",
  fontWeight: 800,
};

const retryBtn = {
  marginTop: 12,
  padding: 14,
  width: "100%",
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg,#f59e0b,#f97316)",
  color: "#fff",
  fontWeight: 800,
};

const info = {
  marginTop: 30,
  fontSize: 13,
  color: "#94a3b8",
};