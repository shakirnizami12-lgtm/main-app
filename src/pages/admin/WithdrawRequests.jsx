import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

export default function WithdrawRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "withdraw_requests"),
      (snap) => {
        const arr = [];
        snap.forEach((d) => {
          arr.push({ id: d.id, ...d.data() });
        });
        setRequests(arr);
      }
    );

    return () => unsub();
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "withdraw_requests", id), {
      status,
      processedAt: new Date(),
    });
    alert(`Request ${status}`);
  };

  return (
    <AdminLayout>
      <h2>💸 Withdraw Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}

      {requests.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
            borderRadius: 6,
            background: "#fff",
          }}
        >
          <p><b>User UID:</b> {r.uid}</p>
          <p><b>Coins:</b> {r.amountCoins}</p>
          <p><b>Amount:</b> ₹{r.amountINR || r.amountUsd}</p>
          <p><b>Method:</b> {r.method}</p>
          <p><b>Status:</b> {r.status}</p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => navigate(`/admin/withdraw/${r.id}`)}
            >
              View
            </button>

            {r.status === "pending" && (
              <>
                <button
                  style={{ background: "green", color: "#fff" }}
                  onClick={() => updateStatus(r.id, "approved")}
                >
                  Approve
                </button>

                <button
                  style={{ background: "red", color: "#fff" }}
                  onClick={() => updateStatus(r.id, "rejected")}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </AdminLayout>
  );
}