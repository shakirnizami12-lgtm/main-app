import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useCoins } from "../context/CoinContext";

export default function SpinPage() {
  const { user } = useAuth();
  const { coins, refreshCoins } = useCoins();

  const [loading, setLoading] = useState(true);

  // admin settings
  const [enabled, setEnabled] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [freeSpin, setFreeSpin] = useState(1);
  const [adTime, setAdTime] = useState(15);
  const [rewards, setRewards] = useState([]);

  // user
  const [spinToday, setSpinToday] = useState(0);
  const [adUnlocked, setAdUnlocked] = useState(false);

  // ui
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [watchingAd, setWatchingAd] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);

  /* LOAD SETTINGS */
  useEffect(() => {
    const load = async () => {
      const spinSnap = await getDoc(doc(db, "settings", "spin"));
      if (spinSnap.exists()) {
        const d = spinSnap.data();
        setEnabled(d.enabled);
        setDailyLimit(d.dailyLimit);
        setFreeSpin(d.freeSpin ?? 1);
        setAdTime(d.adWatchTime ?? 15);
        setRewards(d.rewards || []);
      }

      const userRef = doc(db, "users", user.uid);
      const uSnap = await getDoc(userRef);
      const today = new Date().toDateString();

      if (uSnap.exists()) {
        const u = uSnap.data();
        if (u.lastSpinDate === today) {
          setSpinToday(u.spinToday || 0);
          setAdUnlocked(u.adUnlockedSpin || false);
        } else {
          await updateDoc(userRef, {
            spinToday: 0,
            adUnlockedSpin: false,
            lastSpinDate: today,
          });
        }
      }

      setLoading(false);
    };
    load();
  }, [user.uid]);

  /* AD TIMER */
  useEffect(() => {
    if (!watchingAd) return;
    if (timeLeft === 0) {
      unlockSpin();
      return;
    }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [watchingAd, timeLeft]);

  const canFreeSpin = spinToday < freeSpin;
  const needAd = !canFreeSpin && !adUnlocked;

  const startAd = () => {
    setWatchingAd(true);
    setTimeLeft(adTime);
  };

  const unlockSpin = async () => {
    setWatchingAd(false);
    setAdUnlocked(true);
    await updateDoc(doc(db, "users", user.uid), { adUnlockedSpin: true });
  };

  /* WEIGHTED PICK */
  const pickReward = () => {
    const pool = [];
    rewards.forEach(r => {
      for (let i = 0; i < r.chance; i++) pool.push(r.value);
    });
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const spinNow = async () => {
    if (!enabled) return alert("Spin disabled");
    if (spinToday >= dailyLimit) return alert("Daily limit reached");

    setIsSpinning(true);
    setResult(null);

    const reward = pickReward();
    const index = rewards.findIndex(r => r.value === reward);
    const slice = 360 / rewards.length;
    const targetRotation =
      360 * 5 + (360 - index * slice - slice / 2);

    setRotation(targetRotation);

    setTimeout(async () => {
      await updateDoc(doc(db, "users", user.uid), {
        coins: increment(reward),
        spinToday: increment(1),
        adUnlockedSpin: false,
        lastSpinDate: new Date().toDateString(),
      });

      setSpinToday(p => p + 1);
      setAdUnlocked(false);
      setResult(reward);
      refreshCoins();
      setIsSpinning(false);
    }, 3500);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={wrap}>
      <h2>Spin & Win</h2>
      <p>Daily Spins: {spinToday}/{dailyLimit}</p>

      {/* POINTER */}
      <div style={pointer}></div>

      {/* WHEEL */}
      <div
        style={{
          ...wheel,
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? "transform 3.5s cubic-bezier(0.17,0.67,0.12,0.99)"
            : "none",
        }}
      >
        {rewards.map((r, i) => (
          <div
            key={i}
            style={{
              ...sliceStyle,
              transform: `rotate(${(360 / rewards.length) * i}deg)`,
              background: i % 2 === 0 ? "#22c55e" : "#16a34a",
            }}
          >
            <span style={label}>{r.value} coins</span>
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      {spinToday >= dailyLimit ? (
        <button disabled style={btnGray}>Daily Limit Reached</button>
      ) : needAd ? (
        !watchingAd ? (
          <button onClick={startAd} style={btnBlue}>
            Watch Ad to Spin
          </button>
        ) : (
          <button disabled style={btnYellow}>
            Watching Ad... {timeLeft}s
          </button>
        )
      ) : (
        <button onClick={spinNow} disabled={isSpinning} style={btnGreen}>
          {isSpinning ? "Spinning..." : "Spin Now"}
        </button>
      )}

      {result && <p>You won {result} coins</p>}
    </div>
  );
}

/* ===== STYLES ===== */
const wrap = { padding: 20, maxWidth: 420, margin: "auto", textAlign: "center" };

const wheel = {
  width: 280,
  height: 280,
  borderRadius: "50%",
  margin: "20px auto",
  position: "relative",
  overflow: "hidden",
  border: "10px solid #16a34a",
};

const sliceStyle = {
  position: "absolute",
  width: "50%",
  height: "50%",
  top: "50%",
  left: "50%",
  transformOrigin: "0% 0%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const label = {
  transform: "rotate(90deg)",
  fontWeight: "bold",
  color: "#fff",
};

const pointer = {
  width: 0,
  height: 0,
  borderLeft: "12px solid transparent",
  borderRight: "12px solid transparent",
  borderBottom: "20px solid #111",
  margin: "0 auto",
};

const btnGreen = {
  width: "100%",
  padding: 12,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 10,
};

const btnBlue = { ...btnGreen, background: "#2563eb" };
const btnYellow = { ...btnGreen, background: "#f59e0b" };
const btnGray = { ...btnGreen, background: "#9ca3af" };