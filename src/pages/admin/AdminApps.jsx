import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const AdminApps = () => {
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    name: "",
    logo: "",
    storeUrl: "",
    rewardCoins: "",
    instructions: "",
    active: true
  });
  const [loading, setLoading] = useState(false);

  const loadApps = async () => {
    const snap = await getDocs(collection(db, "apps"));
    setApps(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleAddApp = async () => {
    if (!form.name || !form.logo || !form.storeUrl || !form.rewardCoins) {
      alert("All required fields bharo");
      return;
    }

    setLoading(true);
    await addDoc(collection(db, "apps"), {
      ...form,
      rewardCoins: Number(form.rewardCoins),
      createdAt: new Date()
    });

    setForm({
      name: "",
      logo: "",
      storeUrl: "",
      rewardCoins: "",
      instructions: "",
      active: true
    });

    setLoading(false);
    loadApps();
  };

  const toggleStatus = async (app) => {
    await updateDoc(doc(db, "apps", app.id), { active: !app.active });
    loadApps();
  };

  return (
    <div style={page}>
      <h2>🛠 Admin – App Install Tasks</h2>

      {/* ADD FORM */}
      <div style={card}>
        <h3>Add New App</h3>

        <input style={input} placeholder="App Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input style={input} placeholder="Logo URL"
          value={form.logo}
          onChange={e => setForm({ ...form, logo: e.target.value })} />

        <input style={input} placeholder="Play Store URL"
          value={form.storeUrl}
          onChange={e => setForm({ ...form, storeUrl: e.target.value })} />

        <input style={input} type="number" placeholder="Reward Coins (10/20/40)"
          value={form.rewardCoins}
          onChange={e => setForm({ ...form, rewardCoins: e.target.value })} />

        <textarea style={input} placeholder="Instructions"
          value={form.instructions}
          onChange={e => setForm({ ...form, instructions: e.target.value })} />

        <label>
          <input type="checkbox"
            checked={form.active}
            onChange={() => setForm({ ...form, active: !form.active })} /> Active
        </label>

        <br /><br />
        <button style={primaryBtn} onClick={handleAddApp}>
          {loading ? "Adding..." : "Add App"}
        </button>
      </div>

      {/* APPS LIST */}
      <div style={{ marginTop: 30 }}>
        <h3>Existing Apps</h3>

        {apps.map(app => (
          <div key={app.id} style={listCard}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={app.logo} alt="" style={logo} />
              <div>
                <b>{app.name}</b>
                <p>🎁 {app.rewardCoins} Coins</p>
                <small>Status: {app.active ? "Active" : "Inactive"}</small>
              </div>
            </div>

            <button style={secondaryBtn} onClick={() => toggleStatus(app)}>
              {app.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===== STYLES ===== */
const page = { padding: 20, maxWidth: 900, margin: "0 auto" };
const card = { background: "#fff", padding: 20, borderRadius: 16, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" };
const listCard = { ...card, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 };
const input = { width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #ccc" };
const logo = { width: 50, height: 50, borderRadius: 12, marginRight: 12 };
const primaryBtn = { padding: "10px 16px", borderRadius: 10, background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" };
const secondaryBtn = { ...primaryBtn, background: "#fff", color: "#2563eb", border: "1px solid #2563eb" };

export default AdminApps;