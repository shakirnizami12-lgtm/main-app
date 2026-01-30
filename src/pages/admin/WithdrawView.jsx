import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

export default function WithdrawView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "withdraw_requests", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Withdraw not found");
        navigate("/admin/withdraws");
        return;
      }

      setData({ id: snap.id, ...snap.data() });
      setLoading(false);
    };

    load();
  }, [id, navigate]);

  // ✅ APPROVE
  const approve = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      // remove hold coins
      await updateDoc(doc(db, "wallets", data.uid), {
        holdCoins: increment(-data.amountCoins),
        updatedAt: serverTimestamp(),
      });

      // update withdraw
      await updateDoc(doc(db, "withdraw_requests", id), {
        status: "approved",
        processedAt: serverTimestamp(),
      });

      // notification
      await addDoc(collection(db, "notifications"), {
        uid: data.uid,
        title: "Withdraw Approved",
        message: `Your withdraw of ${data.amountCoins} coins has been approved`,
        createdAt: serverTimestamp(),
      });

      alert("Withdraw Approved");
      navigate("/admin/withdraws");
    } catch (e) {
      alert("Error");
      setProcessing(false);
    }
  };

  // ❌ REJECT
  const reject = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      await updateDoc(doc(db, "wallets", data.uid), {
        coinsBalance: increment(data.amountCoins),
        holdCoins: increment(-data.amountCoins),
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "withdraw_requests", id), {
        status: "rejected",
        processedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "notifications"), {
        uid: data.uid,
        title: "Withdraw Rejected",
        message: `Your withdraw of ${data.amountCoins} coins was rejected`,
        createdAt: serverTimestamp(),
      });

      alert("Withdraw Rejected");
      navigate("/admin/withdraws");
    } catch (e) {
      alert("Error");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2>💸 Withdraw Details</h2>

      <p><b>UID:</b> {data.uid}</p>
      <p><b>Coins:</b> {data.amountCoins}</p>
      <p><b>Method:</b> {data.method}</p>

      {data.method === "upi" && (
        <p><b>UPI ID:</b> {data.upiId}</p>
      )}

      {data.method === "crypto" && (
        <>
          <p><b>USDT Address:</b> {data.walletAddress}</p>
          <p><b>Network:</b> BEP20</p>
        </>
      )}

      <br />

      <button
        onClick={approve}
        disabled={processing}
        style={{ background: "green", color: "#fff", padding: 10 }}
      >
        Approve
      </button>

      <button
        onClick={reject}
        disabled={processing}
        style={{ background: "red", color: "#fff", padding: 10, marginLeft: 10 }}
      >
        Reject
      </button>
    </AdminLayout>
  );
}