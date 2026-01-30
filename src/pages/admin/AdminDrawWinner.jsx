import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export const drawWinner = async (lottery) => {
  try {
    if (!lottery.userTickets || Object.keys(lottery.userTickets).length === 0) {
      alert("No tickets sold");
      return;
    }

    // 🎯 Pick random winner UID
    const users = Object.keys(lottery.userTickets);
    const winnerUid = users[Math.floor(Math.random() * users.length)];

    // 🔍 Fetch user email
    const userSnap = await getDoc(doc(db, "users", winnerUid));
    const winnerEmail = userSnap.exists()
      ? userSnap.data().email
      : "Email not found";

    // 🏆 SAVE WINNER (MOST IMPORTANT)
    await addDoc(collection(db, "lottery_winners"), {
      lotteryId: lottery.id,
      lotteryTitle: lottery.title,
      prize: lottery.prize,
      winnerUid,
      winnerEmail,
      drawnAt: serverTimestamp(),
    });

    // 🔒 Update lottery
    await updateDoc(doc(db, "lotteries", lottery.id), {
      winnerDrawn: true,
      status: "closed",
      drawnAt: serverTimestamp(),
    });

    alert("🏆 Winner drawn successfully");
  } catch (err) {
    console.error(err);
    alert("Error drawing winner");
  }
};