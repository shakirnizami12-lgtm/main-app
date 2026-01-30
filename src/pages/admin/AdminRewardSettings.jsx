import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function AdminRewardSettings() {
  const [reward, setReward] = useState(5);
  const [limit, setLimit] = useState(10);
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const ref = doc(db, "settings", "reward_ads");

  useEffect(() => {
    const load = async () => {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const d = snap.data();
        setReward(d.rewardPerAd);
        setLimit(d.dailyLimit);
        setEnabled(d.enabled);
      }
    };
    load();
  }, []);

  const save = async () => {
    setLoading(true);
    await setDoc(ref, {
      rewardPerAd: Number(reward),
      dailyLimit: Number(limit),
      enabled,
    });
    setLoading(false);
    alert("✅ Reward settings updated");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎬 Reward Ads Settings</h2>

      <label>Reward per Ad (coins)</label>
      <input
        type="number"
        value={reward}
        onChange={(e) => setReward(e.target.value)}
      />

      <br /><br />

      <label>Daily Ad Limit</label>
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
      />

      <br /><br />

      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Reward Ads Enabled
      </label>

      <br /><br />

      <button onClick={save} disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}