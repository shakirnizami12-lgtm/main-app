import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminQuizQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // new question states
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  // fetch questions
  const fetchQuestions = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "quiz_questions"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setQuestions(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // add question
  const addQuestion = async () => {
    if (!question.trim()) {
      alert("Question empty hai");
      return;
    }
    if (options.some((o) => !o.trim())) {
      alert("All 4 options required");
      return;
    }

    await addDoc(collection(db, "quiz_questions"), {
      question,
      options,
      correctIndex: Number(correctIndex),
      active: true,
      createdAt: serverTimestamp(),
    });

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);

    fetchQuestions();
  };

  // toggle active
  const toggleActive = async (id, current) => {
    await updateDoc(doc(db, "quiz_questions", id), {
      active: !current,
    });
    fetchQuestions();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontWeight: 800, marginBottom: 20 }}>
        🧠 Admin Quiz Questions
      </h2>

      {/* ADD QUESTION */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          marginBottom: 30,
          maxWidth: 500,
        }}
      >
        <h3>Add New Question</h3>

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
          style={inputStyle}
        />

        {options.map((opt, i) => (
          <input
            key={i}
            value={opt}
            onChange={(e) => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }}
            placeholder={`Option ${i + 1}`}
            style={inputStyle}
          />
        ))}

        <label style={{ fontWeight: 600 }}>Correct Option</label>
        <select
          value={correctIndex}
          onChange={(e) => setCorrectIndex(e.target.value)}
          style={inputStyle}
        >
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>

        <button
          onClick={addQuestion}
          style={{
            marginTop: 10,
            padding: "10px 16px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
          }}
        >
          ➕ Add Question
        </button>
      </div>

      {/* QUESTION LIST */}
      <h3>All Questions</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        questions.map((q, index) => (
          <div
            key={q.id}
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              maxWidth: 600,
            }}
          >
            <b>
              {index + 1}. {q.question}
            </b>

            <ul>
              {q.options?.map((opt, i) => (
                <li
                  key={i}
                  style={{
                    color: i === q.correctIndex ? "green" : "#111",
                    fontWeight: i === q.correctIndex ? 700 : 400,
                  }}
                >
                  {i + 1}. {opt}
                </li>
              ))}
            </ul>

            <span
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                background: q.active ? "#22c55e" : "#ef4444",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {q.active ? "ACTIVE" : "DISABLED"}
            </span>

            <br />

            <button
              onClick={() => toggleActive(q.id, q.active)}
              style={{
                marginTop: 10,
                padding: "6px 14px",
                border: "none",
                borderRadius: 6,
                background: q.active ? "#ef4444" : "#22c55e",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {q.active ? "Disable" : "Enable"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 8,
  marginBottom: 8,
  borderRadius: 8,
  border: "1px solid #ddd",
};