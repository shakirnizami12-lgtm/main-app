import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { drawWinner } from "./AdminDrawWinner";

export default function AdminLottery() {
  const [lotteries, setLotteries] = useState([]);
  const [winnersMap, setWinnersMap] = useState({});

  const [form, setForm] = useState({
    title: "",
    ticketPrice: 10,
    prize: 1000,
    ticketLimitPerUser: 1,
    duration: 1,
    unit: "hours",
  });

  // 🔹 LOAD LOTTERIES
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lotteries"), (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setLotteries(list);
    });
    return () => unsub();
  }, []);

  // 🔹 LOAD WINNERS (lottery_winners)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lottery_winners"), (snap) => {
      const map = {};
      snap.forEach((d) => {
        const data = d.data();
        map[data.lotteryId] = data;
      });
      setWinnersMap(map);
    });
    return () => unsub();
  }, []);

  // 🔹 CREATE LOTTERY
  const createLottery = async () => {
    if (!form.title) return alert("Title required");

    const now = Timestamp.now();
    const ms =
      form.unit === "hours"
        ? form.duration * 60 * 60 * 1000
        : form.duration * 24 * 60 * 60 * 1000;

    await addDoc(collection(db, "lotteries"), {
      title: form.title,
      ticketPrice: Number(form.ticketPrice),
      prize: Number(form.prize),
      ticketLimitPerUser: Number(form.ticketLimitPerUser),
      totalTickets: 0,
      status: "open",
      startAt: now,
      closeAt: Timestamp.fromMillis(now.toMillis() + ms),
      userTickets: {},
      winnerDrawn: false,
      createdAt: now,
    });

    alert("🎉 Lottery Created");
    setForm({ ...form, title: "" });
  };

  // 🔹 CLOSE LOTTERY
  const closeLottery = async (id) => {
    await updateDoc(doc(db, "lotteries", id), {
      status: "closed",
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 520 }}>
      <h2 style={{ fontWeight: 900 }}>🎟 Admin Lottery Control</h2>

      {/* CREATE LOTTERY */}
      <div style={card}>
        <h3>➕ Create New Lottery</h3>

        <input
          style={input}
          placeholder="Lottery Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <div style={row}>
          <input
            style={input}
            type="number"
            placeholder="Ticket Price"
            value={form.ticketPrice}
            onChange={(e) =>
              setForm({ ...form, ticketPrice: e.target.value })
            }
          />
          <input
            style={input}
            type="number"
            placeholder="Reward Pool"
            value={form.prize}
            onChange={(e) => setForm({ ...form, prize: e.target.value })}
          />
        </div>

        <div style={row}>
          <input
            style={input}
            type="number"
            placeholder="Limit / User"
            value={form.ticketLimitPerUser}
            onChange={(e) =>
              setForm({ ...form, ticketLimitPerUser: e.target.value })
            }
          />
          <input
            style={input}
            type="number"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />
          <select
            style={input}
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          >
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>

        <button style={primaryBtn} onClick={createLottery}>
          ➕ Create Lottery
        </button>
      </div>

      {/* LOTTERIES */}
      <h3 style={{ marginTop: 30 }}>📋 All Lotteries</h3>

      {lotteries.map((l) => {
        const winner = winnersMap[l.id];

        return (
          <div key={l.id} style={card}>
            <div style={titleRow}>
              <b>{l.title}</b>
              <span
                style={{
                  ...badge,
                  background: l.status === "open" ? "#22c55e" : "#9ca3af",
                }}
              >
                {l.status.toUpperCase()}
              </span>
            </div>

            <p>🎟 Tickets Sold: {l.totalTickets}</p>
            <p>👤 Limit/User: {l.ticketLimitPerUser}</p>

            {l.status === "open" && (
              <button style={dangerBtn} onClick={() => closeLottery(l.id)}>
                ❌ Close Lottery
              </button>
            )}

            {l.status === "closed" && !l.winnerDrawn && (
              <button style={winnerBtn} onClick={() => drawWinner(l)}>
                🏆 Draw Winner
              </button>
            )}

            {l.winnerDrawn && winner && (
              <div style={winnerBox}>
                <div>✅ Winner Declared</div>
                <div>📧 <b>{winner.winnerEmail || "Email not found"}</b></div>
                <div>🎁 Prize: <b>{winner.prize} coins</b></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* 🎨 STYLES */
const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 18,
  marginBottom: 18,
  boxShadow: "0 15px 35px rgba(0,0,0,.12)",
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  marginBottom: 10,
};

const row = {
  display: "flex",
  gap: 10,
};

const primaryBtn = {
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: "none",
  fontWeight: 800,
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  cursor: "pointer",
};

const dangerBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const winnerBtn = {
  background: "linear-gradient(135deg,#f59e0b,#f97316)",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: 14,
  fontWeight: 800,
  cursor: "pointer",
};

const titleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const badge = {
  color: "#fff",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const winnerBox = {
  marginTop: 12,
  background: "#ecfdf5",
  padding: 12,
  borderRadius: 14,
  fontWeight: 700,
};