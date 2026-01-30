import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminSpinSettings() {
  const [enabled, setEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(5);
  const [rewards, setRewards] = useState([
    { value: 5, chance: 40 },
    { value: 8, chance: 30 },
    { value: 10, chance: 20 },
    { value: 15, chance: 10 },
  ]);

  const [loading, setLoading] = useState(true);

  /* Load settings */
  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(doc(db, "settings", "spin"));
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

  /* Save settings */
  const saveSettings = async () => {
    const totalChance = rewards.reduce((a, b) => a + Number(b.chance), 0);
    if (totalChance !== 100) {
      alert("Total chance must be exactly 100%");
      return;
    }

    await setDoc(doc(db, "settings", "spin"), {
      enabled,
      dailyLimit: Number(dailyLimit),
      rewards: rewards.map(r => ({
        value: Number(r.value),
        chance: Number(r.chance),
      })),
    });

    alert("Spin settings saved");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>🎡 Spin Settings</h2>

      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
        />{" "}
        Spin Enabled
      </label>

      <br /><br />

      <label>
        Daily Spin Limit
        <input
          type="number"
          value={dailyLimit}
          onChange={e => setDailyLimit(e.target.value)}
          style={input}
        />
      </label>

      <h3>Rewards & Chances (%)</h3>

      {rewards.map((r, i) => (
        <div key={i} style={row}>
          <input
            type="number"
            value={r.value}
            disabled
            style={{ ...input, width: 80 }}
          />
          <span>coins</span>
          <input
            type="number"
            value={r.chance}
            onChange={e => {
              const copy = [...rewards];
              copy[i].chance = e.target.value;
              setRewards(copy);
            }}
            style={{ ...input, width: 80 }}
          />
          <span>%</span>
        </div>
      ))}

      <button onClick={saveSettings} style={btn}>
        Save Settings
      </button>
    </div>
  );
}

/* styles */
const input = {
  padding: 6,
  marginLeft: 10,
};

const row = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 8,
};

const btn = {
  marginTop: 15,
  padding: "8px 14px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};