import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [quizForm, setQuizForm] = useState({
    title: "",
    reward: 1,
  });

  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  });

  /* 🔹 LOAD QUIZZES */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "quizzes"), (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setQuizzes(list);
    });
    return () => unsub();
  }, []);

  /* 🔹 CREATE QUIZ */
  const createQuiz = async () => {
    if (!quizForm.title) return alert("Quiz title required");

    await addDoc(collection(db, "quizzes"), {
      title: quizForm.title,
      reward: Number(quizForm.reward),
      enabled: false,
      createdAt: serverTimestamp(),
    });

    setQuizForm({ title: "", reward: 1 });
    alert("Quiz Created ✅");
  };

  /* 🔹 ENABLE / DISABLE QUIZ */
  const toggleQuiz = async (quiz) => {
    await updateDoc(doc(db, "quizzes", quiz.id), {
      enabled: !quiz.enabled,
    });
  };

  /* 🔹 ADD QUESTION */
  const addQuestion = async () => {
    if (!selectedQuiz) return;
    if (!questionForm.question) return alert("Question required");

    await addDoc(
      collection(db, "quizzes", selectedQuiz.id, "questions"),
      {
        question: questionForm.question,
        options: questionForm.options,
        correctIndex: questionForm.correctIndex,
        createdAt: serverTimestamp(),
      }
    );

    setQuestionForm({
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
    });

    alert("Question Added ✅");
  };

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <h2 style={{ fontWeight: 900 }}>🧠 Admin Quiz Control</h2>

      {/* CREATE QUIZ */}
      <div style={card}>
        <h3>➕ Create New Quiz</h3>
        <input
          style={input}
          placeholder="Quiz Title"
          value={quizForm.title}
          onChange={(e) =>
            setQuizForm({ ...quizForm, title: e.target.value })
          }
        />
        <input
          style={input}
          type="number"
          placeholder="Reward Coins"
          value={quizForm.reward}
          onChange={(e) =>
            setQuizForm({ ...quizForm, reward: e.target.value })
          }
        />
        <button style={primaryBtn} onClick={createQuiz}>
          ➕ Add Quiz
        </button>
      </div>

      {/* QUIZ LIST */}
      <h3 style={{ marginTop: 30 }}>📋 All Quizzes</h3>

      {quizzes.map((q) => (
        <div key={q.id} style={card}>
          <b>{q.title}</b>
          <p>🎁 Reward: {q.reward} coins</p>
          <p>Status: {q.enabled ? "🟢 ON" : "🔴 OFF"}</p>

          <button
            style={q.enabled ? dangerBtn : successBtn}
            onClick={() => toggleQuiz(q)}
          >
            {q.enabled ? "Disable Quiz" : "Enable Quiz"}
          </button>

          <button
            style={secondaryBtn}
            onClick={() => setSelectedQuiz(q)}
          >
            ➕ Add Questions
          </button>
        </div>
      ))}

      {/* ADD QUESTION */}
      {selectedQuiz && (
        <div style={card}>
          <h3>❓ Add Question ({selectedQuiz.title})</h3>

          <input
            style={input}
            placeholder="Question"
            value={questionForm.question}
            onChange={(e) =>
              setQuestionForm({ ...questionForm, question: e.target.value })
            }
          />

          {questionForm.options.map((op, i) => (
            <input
              key={i}
              style={input}
              placeholder={`Option ${i + 1}`}
              value={op}
              onChange={(e) => {
                const arr = [...questionForm.options];
                arr[i] = e.target.value;
                setQuestionForm({ ...questionForm, options: arr });
              }}
            />
          ))}

          <select
            style={input}
            value={questionForm.correctIndex}
            onChange={(e) =>
              setQuestionForm({
                ...questionForm,
                correctIndex: Number(e.target.value),
              })
            }
          >
            <option value={0}>Correct Option 1</option>
            <option value={1}>Correct Option 2</option>
            <option value={2}>Correct Option 3</option>
            <option value={3}>Correct Option 4</option>
          </select>

          <button style={primaryBtn} onClick={addQuestion}>
            ✅ Save Question
          </button>
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */
const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  marginBottom: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,.12)",
};

const input = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  marginBottom: 10,
};

const primaryBtn = {
  width: "100%",
  padding: 14,
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  border: "none",
  borderRadius: 14,
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryBtn = {
  marginTop: 8,
  padding: "10px 14px",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const successBtn = {
  padding: "10px 14px",
  background: "#22c55e",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const dangerBtn = {
  padding: "10px 14px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};