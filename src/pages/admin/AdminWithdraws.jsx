import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminWithdraws() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const snap = await getDocs(collection(db, "withdraw_requests"));
    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setRequests(list);
    setLoading(false);
  }

  async function approveWithdraw(req) {
    if (!window.confirm("Approve this withdraw?")) return;

    // 1️⃣ update withdraw status
    await updateDoc(doc(db, "withdraw_requests", req.id), {
      status: "approved",
    });

    // 2️⃣ deduct coins from user
    await updateDoc(doc(db, "users", req.uid), {
      coins: increment(-Number(req.amount)),
    });

    loadRequests();
  }

  async function rejectWithdraw(req) {
    if (!window.confirm("Reject this withdraw?")) return;

    await updateDoc(doc(db, "withdraw_requests", req.id), {
      status: "rejected",
    });

    loadRequests();
  }

  if (loading) return <h3>Loading withdraw requests...</h3>;

  return (
    <div>
      <h2>💸 Withdraw Requests</h2>

      {requests.length === 0 && <p>No requests found</p>}

      {requests.map((r) => (
        <div
          key={r.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
            borderRadius: 6,
          }}
        >
          <p><b>User:</b> {r.email}</p>
          <p><b>Amount:</b> {r.amount}</p>
          <p>
            <b>Status:</b>{" "}
            {r.status === "pending" && "⏳ Pending"}
            {r.status === "approved" && "✅ Approved"}
            {r.status === "rejected" && "❌ Rejected"}
          </p>

          {r.status === "pending" && (
            <>
              <button
                onClick={() => approveWithdraw(r)}
                style={{ marginRight: 10 }}
              >
                Approve
              </button>

              <button onClick={() => rejectWithdraw(r)}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}