import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); // 🔥 AdminProtectedRoute decide karega
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}