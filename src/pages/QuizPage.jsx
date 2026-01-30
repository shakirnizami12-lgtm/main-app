import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function QuizPage() {
  const user = auth.currentUser;

  const [quizIndex, setQuizIndex] = useState(null); // which quiz opened
  const [quizStatus, setQuizStatus] = useState({
    0: "pending",
    1: "locked",
    2: "locked",
  });

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [reward, setReward] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [finished, setFinished] = useState(false);

  /* ================= LOAD QUESTIONS ================= */
  useEffect(() => {
    if (quizIndex === null) return;

    const load = async () => {
      const q = query(
        collection(db, "quizzes"),
        where("active", "==", true)
      );
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push(d.data()));

      setQuestions(list.slice(0, 3)); // 3 questions only
    };

    load();
  }, [quizIndex]);

  /* ================= SELECT OPTION ================= */
  const choose = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setShowNext(true);

    if (i === questions[currentQ].correctIndex) {
      setReward((r) => r + (questions[currentQ].reward || 0));
    }
  };

  /* ================= NEXT ================= */
  const next = async () => {
    alert("📢 Interstitial Ad");

    if (currentQ === 2) {
      finishQuiz();
      return;
    }

    setSelected(null);
    setShowNext(false);
    setCurrentQ((c) => c + 1);
  };

  /* ================= FINISH QUIZ ================= */
  const finishQuiz = async () => {
    alert("🎬 Reward Ad");

    if (user && reward > 0) {
      await updateDoc(doc(db, "users", user.uid), {
        coins: increment(reward),
      });
    }

    const nextStatus = { ...quizStatus };
    nextStatus[quizIndex] = "completed";
    if (quizIndex < 2) nextStatus[quizIndex + 1] = "pending";

    setQuizStatus(nextStatus);
    setQuizIndex(null);
    resetQuiz();
  };

  const resetQuiz = () => {
    setQuestions([]);
    setCurrentQ(0);
    setSelected(null);
    setReward(0);
    setShowNext(false);
  };

  /* ================= QUIZ LIST UI ================= */
  if (quizIndex === null) {
    return (
      <div style={page}>
        <h2 style={{ fontWeight: 900 }}>🧠 Quiz & Earn</h2>

        {[0, 1, 2].map((i) => (
          <div key={i} style={card}>
            <div style={{ fontWeight: 800 }}>Quiz {i + 1}</div>

            <div style={{ marginTop: 6 }}>
              Status:{" "}
              <b>
                {quizStatus[i] === "completed"
                  ? "✅ Completed"
                  : quizStatus[i] === "pending"
                  ? "🟢 Available"
                  : "🔒 Locked"}
              </b>
            </div>

            <button
              disabled={quizStatus[i] !== "pending"}
              onClick={() => setQuizIndex(i)}
              style={{
                ...btn,
                background:
                  quizStatus[i] === "pending"
                    ? "#2563eb"
                    : "#9ca3af",
              }}
            >
              {quizStatus[i] === "completed"
                ? "Completed"
                : "Start Quiz"}
            </button>
          </div>
        ))}
      </div>
    );
  }

  /* ================= QUIZ UI ================= */
  const q = questions[currentQ];

  return (
    <div style={page}>
      <div style={card}>
        <h3>
          Quiz {quizIndex + 1} – Question {currentQ + 1}/3
        </h3>

        <p style={{ fontWeight: 700 }}>{q.question}</p>

        {q.options.map((op, i) => {
          let bg = "#e5e7eb";
          if (selected !== null) {
            if (i === q.correctIndex) bg = "#22c55e";
            else if (i === selected) bg = "#ef4444";
          }

          return (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => choose(i)}
              style={{ ...opt, background: bg }}
            >
              {op}
            </button>
          );
        })}

        {showNext && (
          <button style={btn} onClick={next}>
            {currentQ === 2 ? "Finish Quiz 🎉" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const page = {
  padding: 16,
  minHeight: "100vh",
  background: "#f8fafc",
};

const card = {
  background: "#fff",
  padding: 18,
  borderRadius: 18,
  marginBottom: 16,
  boxShadow: "0 15px 30px rgba(0,0,0,.12)",
};

const btn = {
  marginTop: 12,
  padding: 12,
  width: "100%",
  border: "none",
  borderRadius: 14,
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};

const opt = {
  width: "100%",
  padding: 12,
  borderRadius: 12,
  border: "none",
  marginTop: 8,
  fontWeight: 600,
};