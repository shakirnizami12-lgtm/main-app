import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function LotteryResultPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [lottery, setLottery] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        /* 1️⃣ Get current lottery */
        const lotteryRef = doc(db, "lotteries", "current");
        const lotterySnap = await getDoc(lotteryRef);

        if (lotterySnap.exists()) {
          setLottery(lotterySnap.data());
        }

        /* 2️⃣ Check if user is winner */
        const q = query(
          collection(db, "lottery_winners"),
          where("uid", "==", user.uid),
          where("lotteryId", "==", "current")
        );

        const winSnap = await getDocs(q);

        if (!winSnap.empty) {
          setWinner(winSnap.docs[0].data());
        }
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  if (loading) {
    return <div style={center}>Loading result...</div>;
  }

  /* ⏳ LOTTERY STILL OPEN */
  if (lottery?.status === "open") {
    return (
      <div style={page}>
        <h2>⏳ Lottery Running</h2>
        <div style={card}>
          <p>🎟 Ticket Price: {lottery.ticketPrice} coins</p>
          <p>🏆 Prize Pool: {lottery.prize} coins</p>
          <p>👥 Tickets Sold: {lottery.totalTickets}</p>
          <p>⏰ Closing: {lottery.closeTime}</p>
        </div>
      </div>
    );
  }

  /* 🏆 USER IS WINNER */
  if (winner) {
    return (
      <div style={page}>
        <h2 style={{ color: "#16a34a" }}>🎉 Congratulations!</h2>

        <div style={{ ...card, border: "2px solid #22c55e" }}>
          <p>🎟 Ticket: <b>{winner.ticketNumber}</b></p>
          <p>🏆 Prize Won: <b>{winner.prize} coins</b></p>
          <p>📅 Date: {winner.createdAt?.toDate().toDateString()}</p>
        </div>

        <div style={successBox}>✅ Coins added to your wallet</div>
      </div>
    );
  }

  /* ❌ USER NOT WINNER */
  return (
    <div style={page}>
      <h2>❌ Better Luck Next Time</h2>

      <div style={card}>
        <p>You joined the lottery but didn’t win this round.</p>
        <p>🏆 Prize Pool: {lottery?.prize} coins</p>
        <p>🎁 New lottery coming soon</p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 20,
  minHeight: "100vh",
  background: "#f8fafc",
};

const card = {
  marginTop: 16,
  background: "#fff",
  padding: 18,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const center = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const successBox = {
  marginTop: 16,
  padding: 12,
  background: "#dcfce7",
  color: "#166534",
  borderRadius: 12,
  fontWeight: 600,
};