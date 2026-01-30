import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminWithdrawHistory() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "withdraw_requests"),
      (snap) => {
        const arr = [];
        snap.forEach((doc) => {
          const data = doc.data();

          // ❌ pending ko skip karo
          if (data.status !== "pending") {
            arr.push({ id: doc.id, ...data });
          }
        });

        setList(arr);
      }
    );

    return () => unsub();
  }, []);

  return (
    <AdminLayout>
      <h2>📜 Withdraw History</h2>

      {list.length === 0 && <p>No history found</p>}

      {list.map((w) => (
        <div
          key={w.id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <p><b>UID:</b> {w.uid}</p>
          <p><b>Coins:</b> {w.amountCoins}</p>
          <p><b>Method:</b> {w.method}</p>

          {w.method === "upi" && (
            <p><b>UPI ID:</b> {w.upiId}</p>
          )}

          {w.method === "crypto" && (
            <>
              <p><b>Wallet:</b> {w.walletAddress}</p>
              <p><b>Network:</b> {w.network}</p>
            </>
          )}

          <p>
            <b>Status:</b>{" "}
            {w.status === "approved" ? "✅ Approved" : "❌ Rejected"}
          </p>
        </div>
      ))}
    </AdminLayout>
  );
}