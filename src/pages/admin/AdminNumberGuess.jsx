import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminNumberGuess() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [enabled, setEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState(10);
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(5);
  const [rewardCoins, setRewardCoins] = useState(5);
  const [cooldownSeconds, setCooldownSeconds] = useState(30);

  const configRef = doc(db, "number_guess", "config");

  /* ================= LOAD CONFIG ================= */

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const snap = await getDoc(configRef);

        if (snap.exists()) {
          const d = snap.data();
          setEnabled(d.enabled);
          setDailyLimit(d.dailyLimit);
          setMinNumber(d.minNumber);
          setMaxNumber(d.maxNumber);
          setRewardCoins(d.rewardCoins);
          setCooldownSeconds(d.cooldownSeconds);
        } else {
          // first time create
          await setDoc(configRef, {
            enabled: true,
            dailyLimit: 10,
            minNumber: 1,
            maxNumber: 5,
            rewardCoins: 5,
            cooldownSeconds: 30,
            updatedAt: new Date(),
          });
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load config");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  /* ================= SAVE ================= */

  const saveSettings = async () => {
    setSaving(true);
    try {
      await updateDoc(configRef, {
        enabled,
        dailyLimit: Number(dailyLimit),
        minNumber: Number(minNumber),
        maxNumber: Number(maxNumber),
        rewardCoins: Number(rewardCoins),
        cooldownSeconds: Number(cooldownSeconds),
        updatedAt: new Date(),
      });

      alert("✅ Settings saved");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={center}>Loading...</div>;
  }

  return (
    <div style={page}>
      <h2>🔢 Number Guess Settings</h2>

      <div style={card}>
        <label style={row}>
          <span>Game Enabled</span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
        </label>

        <Field
          label="Daily Limit"
          value={dailyLimit}
          onChange={setDailyLimit}
        />

        <Field
          label="Min Number"
          value={minNumber}
          onChange={setMinNumber}
        />

        <Field
          label="Max Number"
          value={maxNumber}
          onChange={setMaxNumber}
        />

        <Field
          label="Reward Coins (Win)"
          value={rewardCoins}
          onChange={setRewardCoins}
        />

        <Field
          label="Cooldown Seconds"
          value={cooldownSeconds}
          onChange={setCooldownSeconds}
        />

        <button
          onClick={saveSettings}
          disabled={saving}
          style={{
            ...btn,
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

/* ================= FIELD COMPONENT ================= */

function Field({ label, value, onChange }) {
  return (
    <label style={row}>
      <span>{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      />
    </label>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 20,
};

const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "60vh",
};

const card = {
  maxWidth: 420,
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
};

const input = {
  width: 120,
  padding: 6,
  borderRadius: 6,
  border: "1px solid #cbd5f5",
};

const btn = {
  marginTop: 10,
  width: "100%",
  padding: 12,
  borderRadius: 999,
  border: "none",
  background: "#0ea5e9",
  color: "#fff",
  fontSize: 15,
  cursor: "pointer",
};