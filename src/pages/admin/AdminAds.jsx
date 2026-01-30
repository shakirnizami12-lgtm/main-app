import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminAds() {
  const [ads, setAds] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const ref = doc(db, "settings", "ads");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setAds(snap.data());
    });
    return () => unsub();
  }, []);

  const toggle = async (key) => {
    if (!ads) return;
    setSaving(true);
    await updateDoc(doc(db, "settings", "ads"), {
      [key]: !ads[key],
    });
    setSaving(false);
  };

  if (!ads) return <p style={{ padding: 20 }}>Loading ads settings...</p>;

  const row = (label, key) => (
    <div style={rowStyle}>
      <span>{label}</span>
      <button
        onClick={() => toggle(key)}
        style={{
          ...btn,
          background: ads[key] ? "#28a745" : "#dc3545",
        }}
      >
        {ads[key] ? "ON" : "OFF"}
      </button>
    </div>
  );

  return (
    <div style={wrap}>
      <h2>📢 Ads Control Panel</h2>

      {row("Top Banner Ad", "bannerTop")}
      {row("Bottom Banner Ad", "bannerBottom")}
      {row("Reward Ads", "rewardAds")}
      {row("Task Inline Ads", "taskInline")}

      {saving && <p style={{ color: "#999" }}>Saving...</p>}
    </div>
  );
}

/* styles */
const wrap = {
  maxWidth: 400,
  margin: "20px auto",
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,.05)",
  fontFamily: "sans-serif",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 15,
};

const btn = {
  padding: "6px 16px",
  border: "none",
  color: "#fff",
  borderRadius: 20,
  cursor: "pointer",
  fontWeight: "bold",
};