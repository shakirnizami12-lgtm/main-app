import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminRewardLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      const q = query(
        collection(db, "reward_ads_logs"),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLogs(data);
      setLoading(false);
    };

    loadLogs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>🎬 Reward Ads Logs</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#e5e7eb" }}>
            <th style={th}>User</th>
            <th style={th}>Coins</th>
            <th style={th}>Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td style={td}>{log.email || log.uid}</td>
              <td style={td}>{log.coins}</td>
              <td style={td}>
                {log.createdAt?.toDate().toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: 8,
  border: "1px solid #ccc",
};

const td = {
  padding: 8,
  border: "1px solid #ccc",
};