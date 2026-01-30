import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function MysteryBoxPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [openedToday, setOpenedToday] = useState(0);
  const [watching, setWatching] = useState(false);
  const [timer, setTimer] = useState(15);
  const [progress, setProgress] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const [rewardCoins, setRewardCoins] = useState(null); // 👈 modal control

  const today = new Date().toISOString().split("T")[0];

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const settingsSnap = await getDoc(
        doc(db, "mystery_box_settings", "current")
      );

      const dailySnap = await getDoc(
        doc(db, "mystery_box_daily", `${user.uid}_${today}`)
      );

      const opened = dailySnap.exists() ? dailySnap.data().count : 0;

      setSettings(settingsSnap.data());
      setOpenedToday(opened);

      if (opened >= settingsSnap.data().dailyLimit) {
        setLimitReached(true);
      }

      setLoading(false);
    };

    load();
  }, [user]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!watching) return;

    if (timer === 0) {
      finishAd();
      return;
    }

    const i = setInterval(() => {
      setTimer((t) => t - 1);
      setProgress((p) => p + 100 / 15);
    }, 1000);

    return () => clearInterval(i);
  }, [watching, timer]);

  const startAd = () => {
    if (watching || limitReached) return;
    setWatching(true);
    setTimer(15);
    setProgress(0);
  };

  /* ================= FINISH ================= */
  const finishAd = async () => {
    setWatching(false);

    try {
      await runTransaction(db, async (tx) => {
        const settingsRef = doc(db, "mystery_box_settings", "current");
        const userRef = doc(db, "users", user.uid);
        const dailyRef = doc(db, "mystery_box_daily", `${user.uid}_${today}`);
        const logRef = doc(db, "mystery_box_logs", `${user.uid}_${Date.now()}`);

        const settingsSnap = await tx.get(settingsRef);
        const dailySnap = await tx.get(dailyRef);
        const userSnap = await tx.get(userRef);

        const dailyLimit = settingsSnap.data().dailyLimit;
        const opened = dailySnap.exists() ? dailySnap.data().count : 0;

        if (opened >= dailyLimit) {
          setLimitReached(true);
          return;
        }

        // 🎁 reward calc
        const rewards = settingsSnap.data().rewards;
        const roll = Math.random() * 100;
        let sum = 0;
        let reward = rewards[0].coins;

        for (let r of rewards) {
          sum += r.chance;
          if (roll <= sum) {
            reward = r.coins;
            break;
          }
        }

        tx.set(
          dailyRef,
          { uid: user.uid, date: today, count: opened + 1 },
          { merge: true }
        );

        tx.update(userRef, {
          coins: (userSnap.data().coins || 0) + reward,
        });

        tx.set(logRef, {
          uid: user.uid,
          reward,
          date: today,
          createdAt: serverTimestamp(),
        });

        setOpenedToday(opened + 1);
        setRewardCoins(reward); // 👈 show modal

        if (opened + 1 >= dailyLimit) {
          setLimitReached(true);
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={page}>
      <h2>🎁 Mystery Box</h2>
      <p>
        Daily Limit: {settings.dailyLimit} | Opened Today: {openedToday}
      </p>

      {watching && (
        <>
          <div style={progressWrap}>
            <div style={{ ...progressBar, width: `${progress}%` }} />
          </div>
          <p>Watching Ad… {timer}s</p>
        </>
      )}

      {!limitReached ? (
        <button style={btn} disabled={watching} onClick={startAd}>
          ▶ Watch Ad (15s)
        </button>
      ) : (
        <button style={{ ...btn, background: "#9ca3af" }} disabled>
          Daily Limit Reached
        </button>
      )}

      {/* ====== COINS MODAL ====== */}
      {rewardCoins !== null && (
        <div style={overlay}>
          <div style={modal}>
            <div style={{ fontSize: 48 }}>🪙</div>
            <h3>Congratulations!</h3>
            <p>
              You earned <b>{rewardCoins} coins</b>
            </p>
            <button
              style={btn}
              onClick={() => setRewardCoins(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 20,
  textAlign: "center",
};

const btn = {
  marginTop: 20,
  padding: "14px 26px",
  fontSize: 16,
  borderRadius: 999,
  border: "none",
  background: "#22c55e",
  color: "#fff",
  fontWeight: 600,
};

const progressWrap = {
  height: 10,
  width: "100%",
  background: "#e5e7eb",
  borderRadius: 20,
  overflow: "hidden",
  marginTop: 20,
};

const progressBar = {
  height: "100%",
  background: "linear-gradient(90deg,#22c55e,#16a34a)",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "#fff",
  padding: 30,
  borderRadius: 20,
  width: 260,
};