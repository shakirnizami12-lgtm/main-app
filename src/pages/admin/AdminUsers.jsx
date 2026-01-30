import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [coinInput, setCoinInput] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ================= LOAD USERS =================
  const loadUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setUsers(list);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ================= ADD / MINUS COINS =================
  const applyCoins = async (uid, currentCoins = 0) => {
    const raw = coinInput[uid];

    if (raw === undefined || raw === "") {
      alert("Enter coin value (+ or -)");
      return;
    }

    const change = Number(raw);

    if (isNaN(change)) {
      alert("Invalid number");
      return;
    }

    const newCoins = Number(currentCoins) + change;

    if (newCoins < 0) {
      alert("Coins cannot be negative");
      return;
    }

    try {
      await updateDoc(doc(db, "users", uid), {
        coins: newCoins,
      });

      setCoinInput((prev) => ({ ...prev, [uid]: "" }));
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Coin update failed");
    }
  };

  // ================= BLOCK / UNBLOCK =================
  const toggleBlock = async (uid, isBlocked) => {
    try {
      await updateDoc(doc(db, "users", uid), {
        isBlocked: !isBlocked,
      });
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Block update failed");
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading users...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>👥 Admin – User Management</h2>

      <table
        width="100%"
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ marginTop: 15 }}
      >
        <thead>
          <tr>
            <th>Email</th>
            <th>Coins</th>
            <th>Add / Minus Coins</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan="5" align="center">
                No users found
              </td>
            </tr>
          )}

          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email || "N/A"}</td>

              <td>{u.coins ?? 0}</td>

              <td>
                <input
                  type="text"
                  placeholder="+100 / -50"
                  value={coinInput[u.id] || ""}
                  onChange={(e) =>
                    setCoinInput((prev) => ({
                      ...prev,
                      [u.id]: e.target.value,
                    }))
                  }
                  style={{ width: 100 }}
                />
                <button
                  onClick={() => applyCoins(u.id, u.coins)}
                  style={{ marginLeft: 6 }}
                >
                  Apply
                </button>
              </td>

              <td>
                {u.isBlocked ? (
                  <span style={{ color: "red" }}>Blocked</span>
                ) : (
                  <span style={{ color: "green" }}>Active</span>
                )}
              </td>

              <td>
                {/* ACTIVITY – ADMIN ROUTE ONLY */}
                <button
                  onClick={() =>
                    navigate(`/admin/activity/${u.id}`)
                  }
                >
                  Activity
                </button>

                <button
                  onClick={() => toggleBlock(u.id, u.isBlocked)}
                  style={{
                    marginLeft: 6,
                    background: u.isBlocked ? "green" : "red",
                    color: "#fff",
                    border: "none",
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: 10, fontSize: 13, color: "#555" }}>
        ℹ️ Use <b>positive</b> number to add coins and <b>negative</b> number to
        deduct coins.
      </p>
    </div>
  );
}