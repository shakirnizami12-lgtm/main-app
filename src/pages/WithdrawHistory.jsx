import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function WithdrawHistory() {
  const [list, setList] = useState([]);
  const [tab, setTab] = useState("pending");
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "withdraw_requests"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });
      setList(arr);
    });

    return () => unsub();
  }, [user]);

  const filtered = list.filter((w) => w.status === tab);

  return (
    <div style={{ padding: 16 }}>
      <h2>Withdraw History</h2>

      {/* TABS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {["pending", "success", "failed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 12px",
              background: tab === t ? "#1976d2" : "#eee",
              color: tab === t ? "#fff" : "#000",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p>No records</p>}

      {filtered.map((w) => (
        <div
          key={w.id}
          style={{
            background: "#fff",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <p><b>Coins:</b> {w.amountCoins}</p>
          <p><b>Method:</b> {w.method}</p>
          <p><b>Status:</b> {w.status}</p>
        </div>
      ))}
    </div>
  );
}