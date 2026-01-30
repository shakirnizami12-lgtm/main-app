import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminAdsAnalytics() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const snap = await getDocs(collection(db, "ad_logs"));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Ads Analytics</h2>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>User</th>
            <th>Ad Type</th>
            <th>Coins</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(item => (
            <tr key={item.id}>
              <td>{item.email}</td>
              <td>{item.type}</td>
              <td>{item.coins}</td>
              <td>
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}