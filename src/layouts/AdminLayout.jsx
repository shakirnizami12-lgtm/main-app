import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  return (
    <div style={wrap}>
      {/* ========== SIDEBAR ========== */}
      <aside style={sidebar}>
        <h2 style={logo}>⚙️ Admin Panel</h2>

        {/* MAIN */}
        <NavItem to="/admin">📊 Dashboard</NavItem>
        <NavItem to="/admin/users">👤 Users</NavItem>
        <NavItem to="/admin/withdraws">💸 Withdraws</NavItem>
        <NavItem to="/admin/tasks">✅ Task Approvals</NavItem>

        {/* QUIZ */}
        <hr style={line} />
        <NavItem to="/admin/quiz">🧠 Quiz Control</NavItem>
        <NavItem to="/admin/quiz-questions">📋 Quiz Questions</NavItem>

        {/* LOTTERY */}
        <hr style={line} />
        <NavItem to="/admin/lottery">🎟 Lottery</NavItem>

        {/* 🎁 MYSTERY BOX */}
        <NavItem to="/admin/mystery-box">🎁 Mystery Box</NavItem>

        {/* 🔢 NUMBER GUESS (NEW) */}
        <NavItem to="/admin/number-guess">🔢 Number Guess</NavItem>

        {/* EXTRA / SYSTEM */}
        <hr style={line} />
        <NavItem to="/admin/apps">📱 Apps</NavItem>
        <NavItem to="/admin/ads">📺 Ads</NavItem>
        <NavItem to="/admin/ads-analytics">📈 Ads Analytics</NavItem>
        <NavItem to="/admin/analytics">📊 Analytics</NavItem>
        <NavItem to="/admin/reward-settings">🎁 Reward Settings</NavItem>
        <NavItem to="/admin/reward-logs">🧾 Reward Logs</NavItem>
        <NavItem to="/admin/spin-settings">🎡 Spin Settings</NavItem>
        <NavItem to="/admin/user-activity">👣 User Activity</NavItem>
        <NavItem to="/admin/withdraw-history">📜 Withdraw History</NavItem>
        <NavItem to="/admin/game-controls">🎮 Game Controls</NavItem>
        <NavItem to="/admin/logs">🪵 Logs</NavItem>
        <NavItem to="/admin/settings">⚙️ Settings</NavItem>

        <button onClick={handleLogout} style={logoutBtn}>
          🚪 Logout
        </button>
      </aside>

      {/* ========== PAGE CONTENT ========== */}
      <main style={content}>
        <Outlet />
      </main>
    </div>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        ...navItem,
        background: isActive ? "#1e293b" : "transparent",
        color: isActive ? "#fff" : "#cbd5f5",
      })}
    >
      {children}
    </NavLink>
  );
}

/* ================= STYLES ================= */

const wrap = {
  display: "flex",
  minHeight: "100vh",
  background: "#0f172a",
};

const sidebar = {
  width: 240,
  background: "#020617",
  color: "#fff",
  padding: 16,
  display: "flex",
  flexDirection: "column",
};

const logo = {
  fontSize: 20,
  fontWeight: 800,
  marginBottom: 20,
};

const navItem = {
  padding: "10px 14px",
  borderRadius: 8,
  textDecoration: "none",
  marginBottom: 6,
  fontSize: 14,
  transition: "all 0.2s ease",
};

const logoutBtn = {
  marginTop: "auto",
  padding: 10,
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const content = {
  flex: 1,
  padding: 20,
  background: "#f8fafc",
};

const line = {
  border: "1px solid #1e293b",
  margin: "10px 0",
};