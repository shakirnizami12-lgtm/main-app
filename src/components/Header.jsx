import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CoinContext } from "../context/CoinContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user } = useContext(AuthContext);

  // ✅ SAFE COIN CONTEXT (crash नहीं करेगा)
  const coinContext = useContext(CoinContext);
  const coins = coinContext?.coins ?? 0;

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      {/* LEFT */}
      <div style={styles.left}>
        <h2 style={{ margin: 0 }}>EarnFlow</h2>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        {/* ✅ Coins ONLY when user logged in */}
        {user && (
          <div style={styles.balance}>
            💰 {Number(coins).toFixed(2)}
          </div>
        )}

        <span style={styles.icon}>🔔</span>

        {!user ? (
          <button style={styles.loginBtn} onClick={() => navigate("/login")}>
            Login
          </button>
        ) : (
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "60px",
    background: "linear-gradient(90deg,#0f2027,#203a43,#2c5364)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 15px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  left: {
    display: "flex",
    alignItems: "center",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  balance: {
    background: "#0b8457",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "bold",
  },
  icon: {
    fontSize: "18px",
    cursor: "pointer",
  },
  loginBtn: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  logoutBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};