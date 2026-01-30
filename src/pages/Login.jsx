import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 FORCE LOGOUT OLD USER
  useEffect(() => {
    signOut(auth);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email & password required");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      navigate("/");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={wrap}>
      <h2>Login</h2>

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

      <button style={btn} onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p style={{ marginTop: 12 }}>
        New user? <Link to="/register">Register</Link>
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
  background: "#2563eb",
  color: "#fff",
  border: "none",
  fontSize: 16,
};