import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function DailyCheckingPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(1);
  const [lastCheckin, setLastCheckin] = useState("");

  // 🔥 7-day rewards (DAY 7 = 35 coins)
  const rewards = [5, 10, 15, 20, 25, 30, 35];

  /* ================= LOAD USER DATA ================= */
  useEffect(() => {
    if (!user) return;

    const loadUser = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setStreak(data.checkinStreak || 1);
        setLastCheckin(data.lastCheckin || "");
      }
    };

    loadUser();
  }, [user]);

  const todayDate = () =>
    new Date().toISOString().split("T")[0];

  /* ================= CHECK-IN ================= */
  const handleCheckin = async () => {
    if (!user) return;

    const today = todayDate();

    if (lastCheckin === today) {
      alert("❌ Aaj already check-in ho chuka hai");
      return;
    }

    setLoading(true);

    try {
      let newStreak = streak + 1;
      if (newStreak > 7) newStreak = 1;

      const reward = rewards[newStreak - 1];

      const ref = doc(db, "users", user.uid);

      await updateDoc(ref, {
        coins: increment(reward),
        checkinStreak: newStreak,
        lastCheckin: today,
      });

      setStreak(newStreak);
      setLastCheckin(today);

      alert(`🎉 Check-in successful! +${reward} coins`);
    } catch (err) {
      console.error(err);
      alert("❌ Check-in failed");
    }

    setLoading(false);
  };

  return (
    <div style={page}>
      <h2 style={heading}>🔥 Daily Check-in</h2>

      <div style={grid}>
        {rewards.map((coin, i) => {
          const day = i + 1;
          const isCompleted = day < streak;
          const isToday = day === streak;
          const isLocked = day > streak;

          return (
            <div
              key={i}
              style={{
                ...card,
                background: isCompleted
                  ? "linear-gradient(135deg,#22c55e,#16a34a)"
                  : isToday
                  ? "linear-gradient(135deg,#3b82f6,#2563eb)"
                  : "#e5e7eb",
                color: isLocked ? "#64748b" : "#fff",
                transform: isToday ? "scale(1.06)" : "scale(1)",
                boxShadow: isToday
                  ? "0 0 22px rgba(59,130,246,0.6)"
                  : "0 8px 20px rgba(0,0,0,0.12)",
              }}
            >
              <div style={dayText}>Day {day}</div>
              <div style={coinText}>{coin} coins</div>
              <div style={icon}>
                {isCompleted && "✔"}
                {isToday && "🔥"}
                {isLocked && "🔒"}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleCheckin}
        disabled={loading}
        style={btn}
      >
        {loading ? "Checking..." : "Check-in Now"}
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 20,
  minHeight: "100vh",
  background: "linear-gradient(180deg,#f8fafc,#eef2ff)",
};

const heading = {
  fontSize: 22,
  fontWeight: 800,
  marginBottom: 22,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 14,
};

const card = {
  padding: "18px 10px",
  borderRadius: 18,
  textAlign: "center",
  transition: "all 0.3s ease",
};

const dayText = {
  fontWeight: 700,
  fontSize: 14,
};

const coinText = {
  fontSize: 13,
  marginTop: 6,
};

const icon = {
  marginTop: 8,
  fontSize: 18,
};

const btn = {
  marginTop: 30,
  width: "100%",
  padding: 15,
  borderRadius: 14,
  border: "none",
  background: "linear-gradient(135deg,#2563eb,#1e40af)",
  color: "#fff",
  fontSize: 17,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 16px 40px rgba(37,99,235,0.45)",
};