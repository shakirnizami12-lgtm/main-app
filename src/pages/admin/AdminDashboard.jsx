import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [pendingWithdraws, setPendingWithdraws] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);

    try {
      /* ================= USERS ================= */
      const usersSnap = await getDocs(collection(db, "users"));
      setTotalUsers(usersSnap.size);

      let coinSum = 0;
      usersSnap.forEach((doc) => {
        coinSum += doc.data().coins || 0;
      });
      setTotalCoins(coinSum);

      /* ================= WITHDRAWS ================= */
      const withdrawQuery = query(
        collection(db, "withdraw_requests"),
        where("status", "==", "pending")
      );
      const withdrawSnap = await getDocs(withdrawQuery);
      setPendingWithdraws(withdrawSnap.size);
    } catch (err) {
      console.error("Admin dashboard error:", err);
    }

    setLoading(false);
  };

  if (loading) {
    return <div style={page}>Loading dashboard...</div>;
  }

  return (
    <div style={page}>
      <h2 style={heading}>📊 Admin Dashboard</h2>

      <div style={grid}>
        <StatCard
          title="Total Users"
          value={totalUsers}
          color="#2563eb"
        />

        <StatCard
          title="Total Coins"
          value={totalCoins}
          color="#16a34a"
        />

        <StatCard
          title="Pending Withdraws"
          value={pendingWithdraws}
          color="#dc2626"
        />
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        ...card,
        borderLeft: `6px solid ${color}`,
      }}
    >
      <div style={cardTitle}>{title}</div>
      <div style={{ ...cardValue, color }}>{value}</div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 20,
  minHeight: "100vh",
  background: "#f8fafc",
};

const heading = {
  fontSize: 24,
  fontWeight: 800,
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 14,
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const cardTitle = {
  fontSize: 14,
  color: "#64748b",
  marginBottom: 8,
};

const cardValue = {
  fontSize: 26,
  fontWeight: 800,
};