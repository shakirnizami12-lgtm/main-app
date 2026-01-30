import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminUserActivity() {
  const [params] = useSearchParams();
  const uid = params.get("uid");

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const loadActivity = async () => {
      try {
        const q = query(
          collection(db, "users", uid, "activity"),
          orderBy("time", "desc")
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setLogs(list);
      } catch (e) {
        console.error(e);
        alert("Failed to load activity");
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [uid]);

  if (!uid) return <div style={{ padding: 20 }}>User not found</div>;
  if (loading) return <div style={{ padding: 20 }}>Loading activity...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📜 User Activity</h2>

      {logs.length === 0 && <p>No activity found</p>}

      <table
        width="100%"
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ marginTop: 15 }}
      >
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>By</th>
            <th>Note</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td>
                {l.time?.toDate
                  ? l.time.toDate().toLocaleString()
                  : "-"}
              </td>

              <td>{l.type}</td>

              <td
                style={{
                  color: l.amount >= 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {l.amount}
              </td>

              <td>{l.by}</td>
              <td>{l.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}