import { useCoins } from "../context/CoinContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopHeader() {
  const { coins } = useCoins();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={header}>
      <div style={{ fontWeight: 700 }}>💸 EarnFlow</div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={coinBox}>🪙 {coins}</div>
        <button
          style={logoutBtn}
          onClick={() => logout().then(() => navigate("/login"))}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

const header = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 56,
  background: "#020617",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 14px",
  zIndex: 1000,
};

const coinBox = {
  background: "#1e293b",
  padding: "6px 12px",
  borderRadius: 999,
};

const logoutBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 8,
};