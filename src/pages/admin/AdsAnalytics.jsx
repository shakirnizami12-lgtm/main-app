import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";


export default function AdminAnalytics() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const snap = await getDocs(collection(db, "ads_stats"));
      const data = snap.docs.map(d => ({
        date: d.id,
        views: d.data().views || 0,
        clicks: d.data().clicks || 0,
        revenue: d.data().revenue || 0,
      }));
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading analytics...</p>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <AdminSidebar />

      <div style={{ flex: 1, padding: 30, background: "#f4f6f8" }}>
        <h2>Ads Analytics</h2>

        {stats.map((day) => (
          <div key={day.date} style={{
            background: "#fff",
            padding: 15,
            borderRadius: 8,
            marginBottom: 15
          }}>
            <strong>{day.date}</strong>

            {/* Views Bar */}
            <Bar label="Views" value={day.views} color="#3498db" />

            {/* Clicks Bar */}
            <Bar label="Clicks" value={day.clicks} color="#2ecc71" />

            {/* Revenue Bar */}
            <Bar label="Revenue" value={day.revenue} color="#f39c12" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Bar({ label, value, color }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 12 }}>{label}: {value}</div>
      <div style={{
        height: 10,
        background: "#eee",
        borderRadius: 5,
        overflow: "hidden"
      }}>
        <div style={{
          width: Math.min(value * 10, 100) + "%",
          background: color,
          height: "100%"
        }} />
      </div>
    </div>
  );
}