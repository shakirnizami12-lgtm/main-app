import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function Notifications() {
  const [list, setList] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
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

  return (
    <div style={{ padding: 16 }}>
      <h2>🔔 Notifications</h2>

      {list.length === 0 && (
        <p style={{ marginTop: 20 }}>No notifications yet</p>
      )}

      {list.map((n) => (
        <div
          key={n.id}
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 14,
            marginBottom: 12,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h4 style={{ margin: "0 0 6px 0" }}>{n.title}</h4>
          <p style={{ margin: 0 }}>{n.message}</p>

          <small style={{ color: "#666" }}>
            {n.createdAt?.toDate
              ? n.createdAt.toDate().toLocaleString()
              : ""}
          </small>
        </div>
      ))}
    </div>
  );
}