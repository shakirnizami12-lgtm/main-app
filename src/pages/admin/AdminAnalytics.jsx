import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);

  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState(0);

  const [totalWithdraws, setTotalWithdraws] = useState(0);
  const [pendingWithdraws, setPendingWithdraws] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      /* ================= USERS ================= */
      const usersSnap = await getDocs(collection(db, "users"));
      setTotalUsers(usersSnap.size);

      let active = 0;
      let blocked = 0;

      usersSnap.forEach((doc) => {
        const u = doc.data();
        if (u.isBlocked === true) {
          blocked++;
        } else {
          active++;
        }
      });

      setActiveUsers(active);
      setBlockedUsers(blocked);

      /* ================= WITHDRAWS ================= */
      // ⚠️ Agar tumhari collection ka naam different ho
      // to "withdraw_requests" ko change kar dena
      const withdrawSnap = await getDocs(
        collection(db, "withdraw_requests")
      );
      setTotalWithdraws(withdrawSnap.size);

      const pendingSnap = await getDocs(
        query(
          collection(db, "withdraw_requests"),
          where("status", "==", "pending")
        )
      );
      setPendingWithdraws(pendingSnap.size);

    } catch (err) {
      console.error(err);
      alert("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading analytics...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Admin Analytics</h2>

      <div style={grid}>
        <Card title="Total Users" value={totalUsers} color="#2563eb" />
        <Card title="Active Users" value={activeUsers} color="#16a34a" />
        <Card title="Blocked Users" value={blockedUsers} color="#dc2626" />
        <Card title="Total Withdraws" value={totalWithdraws} color="#7c3aed" />
        <Card title="Pending Withdraws" value={pendingWithdraws} color="#ea580c" />
      </div>
    </div>
  );
}

/* ================= CARD COMPONENT ================= */
function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        padding: 20,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
      }}
    >
      <h4 style={{ margin: 0, color: "#555" }}>{title}</h4>
      <p style={{ fontSize: 28, margin: "10px 0 0", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}

/* ================= STYLES ================= */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
  marginTop: 20,
};