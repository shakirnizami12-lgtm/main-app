import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";


export default function AdminSettings() {
  const [settings, setSettings] = useState(null);

  // Load reward ads settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "reward_ads"), (snap) => {
      if (snap.exists()) setSettings(snap.data());
    });
    return () => unsub();
  }, []);

  const toggleEnabled = async () => {
    if (!settings) return;
    await updateDoc(doc(db, "settings", "reward_ads"), {
      enabled: !settings.enabled,
    });
  };

  const updateLimit = async (value) => {
    await updateDoc(doc(db, "settings", "reward_ads"), {
      dailyLimit: Number(value),
    });
  };

  const updateCoins = async (value) => {
    await updateDoc(doc(db, "settings", "reward_ads"), {
      rewardCoins: Number(value),
    });
  };

  if (!settings) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <AdminLayout>
      <h1>⚙️ Reward Ads Control</h1>

      {/* Enable / Disable */}
      <div style={box}>
        <strong>Reward Ads</strong>
        <button onClick={toggleEnabled}>
          {settings.enabled ? "ON ✅" : "OFF ❌"}
        </button>
      </div>

      {/* Daily Limit */}
      <div style={box}>
        <strong>Daily Ads Limit</strong>
        <select
          value={settings.dailyLimit}
          onChange={(e) => updateLimit(e.target.value)}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Coins Per Ad */}
      <div style={box}>
        <strong>Coins Per Ad</strong>
        <input
          type="number"
          value={settings.rewardCoins}
          onChange={(e) => updateCoins(e.target.value)}
          style={{ width: 80 }}
        />
      </div>
    </AdminLayout>
  );
}

const box = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
  padding: "12px 16px",
  borderRadius: 8,
  marginBottom: 16,
};