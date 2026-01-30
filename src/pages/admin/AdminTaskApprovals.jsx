import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, increment } from "firebase/firestore";
import { db } from "../../firebase";

const AdminTaskApprovals = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const snap = await getDocs(collection(db, "task_requests"));
    setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approveTask = async (r) => {
    await updateDoc(doc(db, "users", r.userId), {
      coins: increment(r.rewardCoins)
    });
    await updateDoc(doc(db, "task_requests", r.id), { status: "approved" });
    loadRequests();
  };

  const rejectTask = async (r) => {
    await updateDoc(doc(db, "task_requests", r.id), { status: "rejected" });
    loadRequests();
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>✅ Task Approvals</h2>

      {requests.map(r => (
        <div key={r.id} style={card}>
          <p><b>App:</b> {r.appName}</p>
          <p><b>Email:</b> {r.email}</p>
          <p><b>Mobile:</b> {r.mobile}</p>
          <p><b>Reward:</b> {r.rewardCoins} coins</p>

          <p>
            Status:
            {r.status === "pending" && <span style={pending}> Pending</span>}
            {r.status === "approved" && <span style={approved}> Approved</span>}
            {r.status === "rejected" && <span style={rejected}> Rejected</span>}
          </p>

          {r.status === "pending" && (
            <div style={{ marginTop: 10 }}>
              <button style={approveBtn} onClick={() => approveTask(r)}>Approve</button>
              <button style={rejectBtn} onClick={() => rejectTask(r)}>Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 14,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  marginBottom: 14
};

const pending = { color: "#f59e0b", fontWeight: "bold" };
const approved = { color: "#16a34a", fontWeight: "bold" };
const rejected = { color: "#dc2626", fontWeight: "bold" };

const approveBtn = {
  padding: "8px 14px",
  borderRadius: 8,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  marginRight: 10,
  cursor: "pointer"
};

const rejectBtn = {
  ...approveBtn,
  background: "#dc2626"
};

export default AdminTaskApprovals;