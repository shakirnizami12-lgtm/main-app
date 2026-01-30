import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Email & password required");
      return;
    }

    if (password.length < 6) {
      alert("Password minimum 6 characters");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Firebase Auth
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = res.user;

      // 🔥 Firestore user doc
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        coins: 0,
        createdAt: serverTimestamp(),
      });

      navigate("/"); // ✅ home
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={wrap}>
      <h2>Create Account</h2>

      <input
        style={input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={btn} onClick={handleRegister} disabled={loading}>
        {loading ? "Creating..." : "Register"}
      </button>

      <p style={{ marginTop: 12 }}>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

const wrap = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: 20,
};

const input = {
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
};

const btn = {
  padding: 12,
  borderRadius: 8,
  background: "#16a34a",
  color: "#fff",
  border: "none",
  fontSize: 16,
};