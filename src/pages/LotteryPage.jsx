import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function LotteryPage() {
  const [tab, setTab] = useState("lottery"); // NEW
  const [lotteries, setLotteries] = useState([]);
  const [winners, setWinners] = useState([]); // NEW
  const [coins, setCoins] = useState(0);
  const [now, setNow] = useState(Date.now());
  const user = auth.currentUser;

  // 🔹 LIVE TIMER
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // 🔹 USER COINS
  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, "users", user.uid), (snap) => {
      const c = Number(snap.data()?.coins || 0);
      setCoins(isNaN(c) ? 0 : c);
    });
  }, [user]);

  // 🔹 LIVE LOTTERIES
  useEffect(() => {
    return onSnapshot(collection(db, "lotteries"), (snap) => {
      const list = [];
      snap.forEach((d) => {
        if (d.data().status === "open") {
          list.push({ id: d.id, ...d.data() });
        }
      });
      setLotteries(list);
    });
  }, []);

  // 🔹 RECENT WINNERS (NEW)
  useEffect(() => {
    const q = query(
      collection(db, "lottery_winners"),
      orderBy("drawnAt", "desc"),
      limit(10)
    );
    return onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      setWinners(list);
    });
  }, []);

  // 🔹 BUY TICKET (UNCHANGED)
  const buyTicket = async (e, lottery) => {
    e.preventDefault();
    if (!user) return alert("Login required");

    const myTickets = lottery.userTickets?.[user.uid] || 0;
    if (myTickets >= lottery.ticketLimitPerUser)
      return alert("Ticket limit reached");

    if (coins < lottery.ticketPrice)
      return alert("Insufficient balance");

    try {
      await runTransaction(db, async (tx) => {
        const lotteryRef = doc(db, "lotteries", lottery.id);
        const userRef = doc(db, "users", user.uid);

        const lSnap = await tx.get(lotteryRef);
        const uSnap = await tx.get(userRef);

        const lData = lSnap.data();
        const current = lData.userTickets?.[user.uid] || 0;

        tx.update(userRef, {
          coins: uSnap.data().coins - lData.ticketPrice
        });

        tx.update(lotteryRef, {
          totalTickets: (lData.totalTickets || 0) + 1,
          [`userTickets.${user.uid}`]: current + 1,
          updatedAt: serverTimestamp()
        });
      });

      alert("🎉 Ticket Purchased Successfully!");
    } catch (err) {
      alert(err);
    }
  };

  // 🔹 TIME FORMAT
  const getTimeLeft = (closeAt) => {
    if (!closeAt?.toMillis) return "—";
    const diff = closeAt.toMillis() - now;
    if (diff <= 0) return "Closed";

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto" }}>
      <h2 style={{ fontWeight: 800 }}>🎟 Lottery</h2>

      {/* 🔝 TOP OPTIONS (NEW) */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => setTab("lottery")} style={tabBtn(tab === "lottery")}>
          🎟 Live
        </button>
        <button onClick={() => setTab("winners")} style={tabBtn(tab === "winners")}>
          🏆 Winners
        </button>
      </div>

      {/* 💰 BALANCE */}
      <div style={balanceBox}>
        <div style={{ fontSize: 13 }}>Available Balance</div>
        <div style={{ fontSize: 26, fontWeight: 900 }}>
          {coins.toLocaleString()} 🪙
        </div>
      </div>

      {/* 🎟 LIVE LOTTERIES */}
      {tab === "lottery" &&
        lotteries.map((lottery) => {
          const myTickets = lottery.userTickets?.[user.uid] || 0;
          const disabled =
            myTickets >= lottery.ticketLimitPerUser ||
            coins < lottery.ticketPrice;

          return (
            <div key={lottery.id} style={card}>
              <h3>{lottery.title}</h3>
              <span style={liveTag}>● LIVE</span>

              <p>🎫 Ticket Price: <b>{lottery.ticketPrice}</b></p>

              <div style={rewardBox}>
                🏆 Reward Pool: {lottery.prize}
              </div>

              <p>Total Tickets: <b>{lottery.totalTickets || 0}</b></p>
              <p>Your Tickets: <b>{myTickets}/{lottery.ticketLimitPerUser}</b></p>
              <p>⏳ Time Left: <b>{getTimeLeft(lottery.closeAt)}</b></p>

              <button
                onClick={(e) => buyTicket(e, lottery)}
                disabled={disabled}
                style={buyBtn(disabled)}
              >
                {disabled ? "Limit / Balance Issue" : "🎟 Buy Ticket"}
              </button>
            </div>
          );
        })}

      {/* 🏆 WINNERS TAB (NEW) */}
      {tab === "winners" &&
        winners.map((w, i) => (
          <div key={i} style={card}>
            <h3>🏆 {w.lotteryTitle}</h3>
            <p>
              👤 Winner:{" "}
              <b>{w.winnerEmail?.replace(/(.{2}).+(@.+)/, "$1***$2")}</b>
            </p>
            <div style={rewardBox}>🪙 Prize: {w.prize}</div>
          </div>
        ))}
    </div>
  );
}

/* 🎨 STYLES (ONLY UI) */
const tabBtn = (active) => ({
  flex: 1,
  padding: 12,
  borderRadius: 14,
  border: "none",
  fontWeight: 800,
  background: active ? "#2563eb" : "#e5e7eb",
  color: active ? "#fff" : "#111"
});

const balanceBox = {
  background: "linear-gradient(135deg,#f59e0b,#f97316)",
  color: "#fff",
  padding: 16,
  borderRadius: 18,
  marginBottom: 20
};

const card = {
  background: "#fff",
  borderRadius: 20,
  padding: 18,
  marginBottom: 20,
  boxShadow: "0 20px 40px rgba(0,0,0,.12)"
};

const liveTag = {
  background: "#16a34a",
  color: "#fff",
  padding: "4px 12px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 700
};

const rewardBox = {
  background: "#fef3c7",
  padding: 10,
  borderRadius: 14,
  margin: "10px 0",
  textAlign: "center",
  fontWeight: 700
};

const buyBtn = (disabled) => ({
  width: "100%",
  marginTop: 14,
  padding: 14,
  borderRadius: 16,
  border: "none",
  fontWeight: 800,
  background: disabled ? "#9ca3af" : "#22c55e",
  color: "#fff"
});