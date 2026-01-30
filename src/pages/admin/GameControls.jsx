import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

export default function GameControls() {
  const { appSettings: settings, loading } = useSettings();
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleUpdate = async (field, value) => {
    try {
      await updateDoc(doc(db, "settings", "app"), {
        [field]: value
      });
      setMessage({ text: "Updated successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: "Update failed: " + err.message, type: "error" });
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading Controls...</div>;

  const sectionStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #eee"
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100px"
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
        <button onClick={() => navigate("/admin/dashboard")} style={{ padding: "8px 16px", cursor: "pointer" }}>← Back</button>
        <h1>🎮 Game & Earning Controls</h1>
      </div>

      {message.text && (
        <div style={{ 
          padding: "15px", 
          backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
          color: message.type === "success" ? "#155724" : "#721c24",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          {message.text}
        </div>
      )}

      {/* Daily Check-in */}
      <div style={sectionStyle}>
        <h3>📅 Daily Check-in</h3>
        <div style={rowStyle}>
          <span>Enable Daily Bonus</span>
          <input 
            type="checkbox" 
            checked={settings.dailyBonusEnabled || false} 
            onChange={(e) => handleUpdate("dailyBonusEnabled", e.target.checked)}
            style={{ width: "20px", height: "20px" }}
          />
        </div>
        <div style={rowStyle}>
          <span>Bonus Coins</span>
          <input 
            type="number" 
            value={settings.dailyBonusCoins || 0} 
            onChange={(e) => handleUpdate("dailyBonusCoins", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Reward Ads */}
      <div style={sectionStyle}>
        <h3>📺 Reward Ads</h3>
        <div style={rowStyle}>
          <span>Enable Reward Ads</span>
          <input 
            type="checkbox" 
            checked={settings.rewardAdsEnabled || false} 
            onChange={(e) => handleUpdate("rewardAdsEnabled", e.target.checked)}
            style={{ width: "20px", height: "20px" }}
          />
        </div>
        <div style={rowStyle}>
          <span>Coins per Ad</span>
          <input 
            type="number" 
            value={settings.rewardAdCoins || 0} 
            onChange={(e) => handleUpdate("rewardAdCoins", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={rowStyle}>
          <span>Daily Ad Limit</span>
          <input 
            type="number" 
            value={settings.rewardAdsDailyLimit || 0} 
            onChange={(e) => handleUpdate("rewardAdsDailyLimit", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Spin & Win */}
      <div style={sectionStyle}>
        <h3>🎡 Spin & Win</h3>
        <div style={rowStyle}>
          <span>Enable Spin Wheel</span>
          <input 
            type="checkbox" 
            checked={settings.spinEnabled || false} 
            onChange={(e) => handleUpdate("spinEnabled", e.target.checked)}
            style={{ width: "20px", height: "20px" }}
          />
        </div>
        <div style={rowStyle}>
          <span>Daily Spin Limit</span>
          <input 
            type="number" 
            value={settings.spinDailyLimit || 0} 
            onChange={(e) => handleUpdate("spinDailyLimit", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={rowStyle}>
          <span>Minimum Coins</span>
          <input 
            type="number" 
            value={settings.spinMinCoins || 0} 
            onChange={(e) => handleUpdate("spinMinCoins", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={rowStyle}>
          <span>Maximum Coins</span>
          <input 
            type="number" 
            value={settings.spinMaxCoins || 0} 
            onChange={(e) => handleUpdate("spinMaxCoins", parseInt(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div style={rowStyle}>
          <span>Require Ad for Spins (after first)</span>
          <input 
            type="checkbox" 
            checked={settings.spinAdRequired || false} 
            onChange={(e) => handleUpdate("spinAdRequired", e.target.checked)}
            style={{ width: "20px", height: "20px" }}
          />
        </div>
      </div>
    </div>
  );
}
