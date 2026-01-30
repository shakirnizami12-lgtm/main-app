import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export default function RecentWinners() {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "lottery_winners"),
      orderBy("drawnAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setWinners(list);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 16, maxWidth: 420, margin: "auto" }}>
      <h2 style={{ fontWeight: 900, marginBottom: 14 }}>
        🏆 Recent Lottery Winners
      </h2>

      {winners.length === 0 && (
        <div style={{ color: "#6b7280", fontSize: 14 }}>
          No winners announced yet
        </div>
      )}

      {winners.map((w) => (
        <div
          key={w.id}
          style={{
            background: "linear-gradient(135deg,#fff,#f9fafb)",
            borderRadius: 18,
            padding: 16,
            marginBottom: 14,
            boxShadow: "0 12px 30px rgba(0,0,0,.12)",
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800 }}>
            🎟 {w.lotteryTitle}
          </div>

          <div style={{ marginTop: 6, fontSize: 14 }}>
            👤 Winner:{" "}
            <b>
              {w.winnerEmail
                ? w.winnerEmail.replace(/(.{2}).+(@.+)/, "$1***$2")
                : "Hidden"}
            </b>
          </div>

          <div
            style={{
              marginTop: 6,
              background: "#fef3c7",
              padding: "8px 12px",
              borderRadius: 12,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            🪙 Prize: {w.prize} coins
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              color: "#6b7280",
              textAlign: "right",
            }}
          >
            {w.drawnAt?.toDate().toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}