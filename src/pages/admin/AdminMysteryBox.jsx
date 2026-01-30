import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminMysteryBox() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(3);
  const [rewards, setRewards] = useState([
    { coins: 2, chance: 70 },
    { coins: 5, chance: 20 },
    { coins: 10, chance: 10 },
  ]);

  /* LOAD SETTINGS */
  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(
        doc(db, "mystery_box_settings", "current")
      );
      if (snap.exists()) {
        const d = snap.data();
        setEnabled(d.enabled);
        setDailyLimit(d.dailyLimit);
        setRewards(d.rewards);
      }
      setLoading(false);
    };
    load();
  }, []);

  /* SAVE SETTINGS */
  const saveSettings = async () => {
    const totalChance = rewards.reduce(
      (s, r) => s + Number(r.chance),
      0
    );

    if (totalChance !== 100) {
      alert("❌ Total chance must be exactly 100%");
      return;
    }

    await updateDoc(
      doc(db, "mystery_box_settings", "current"),
      {
        enabled,
        dailyLimit: Number(dailyLimit),
        rewards,
        updatedAt: new Date(),
      }
    );

    alert("✅ Mystery Box settings saved");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 520, padding: 20 }}>
      <h2>🎁 Mystery Box Control</h2>

      {/* ENABLE */}
      <div style={card}>
        <label>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />{" "}
          Enable Mystery Box
        </label>
      </div>

      {/* DAILY LIMIT */}
      <div style={card}>
        <label>Daily Limit / User</label>
        <input
          type="number"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(e.target.value)}
          style={input}
        />
      </div>

      {/* REWARDS */}
      <div style={card}>
        <h4>Rewards Probability</h4>

        {rewards.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <input
              type="number"
              value={r.coins}
              onChange={(e) => {
                const copy = [...rewards];
                copy[i].coins = e.target.value;
                setRewards(copy);
              }}
              placeholder="Coins"
              style={input}
            />
            <input
              type="number"
              value={r.chance}
              onChange={(e) => {
                const copy = [...rewards];
                copy[i].chance = e.target.value;
                setRewards(copy);
              }}
              placeholder="% Chance"
              style={input}
            />
          </div>
        ))}

        <p style={{ marginTop: 8 }}>
          Total Chance:{" "}
          <b>
            {rewards.reduce(
              (s, r) => s + Number(r.chance),
              0
            )}
            %
          </b>
        </p>
      </div>

      <button style={btn} onClick={saveSettings}>
        💾 Save Settings
      </button>
    </div>
  );
}

/* STYLES */
const card = {
  background: "#fff",
  padding: 16,
  borderRadius: 16,
  marginBottom: 16,
  boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
};

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
};

const btn = {
  width: "100%",
  padding: 14,
  borderRadius: 16,
  border: "none",
  background: "linear-gradient(135deg,#22c55e,#16a34a)",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
};