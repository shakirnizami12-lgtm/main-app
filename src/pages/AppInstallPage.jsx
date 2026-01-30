import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db, auth } from "../firebase";

const AppInstallPage = () => {
  const [apps, setApps] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const user = auth.currentUser;

  useEffect(() => {
    const loadData = async () => {
      const appsSnap = await getDocs(
        query(collection(db, "apps"), where("active", "==", true))
      );

      const appsList = appsSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      const reqSnap = await getDocs(
        query(
          collection(db, "task_requests"),
          where("userId", "==", user.uid)
        )
      );

      const reqList = reqSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      setApps(appsList);
      setRequests(reqList);
      setLoading(false);
    };

    loadData();
  }, [user.uid]);

  const getStatus = (appId) => {
    const req = requests.find(r => r.appId === appId);
    return req ? req.status : null;
  };

  const handleInstall = (app) => {
    window.open(app.storeUrl, "_blank");
    alert("App install karke register karo, phir Complete Task dabao");
  };

  const handleCompleteClick = (app) => {
    setSelectedApp(app);
    setShowForm(true);
  };

  const handleSubmitTask = async () => {
    if (!email || !mobile) {
      alert("Email aur Mobile dono bharo");
      return;
    }

    await addDoc(collection(db, "task_requests"), {
      userId: user.uid,
      appId: selectedApp.id,
      appName: selectedApp.name,
      email,
      mobile,
      rewardCoins: selectedApp.rewardCoins,
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("⏳ Task submitted. Approval ka wait karein");

    setShowForm(false);
    setEmail("");
    setMobile("");
    setSelectedApp(null);

    const reqSnap = await getDocs(
      query(
        collection(db, "task_requests"),
        where("userId", "==", user.uid)
      )
    );

    setRequests(reqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>📲 App Install Tasks</h2>

      {apps.map(app => {
        const status = getStatus(app.id);

        return (
          <div
            key={app.id}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={app.logo}
                alt={app.name}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 16,
                  marginRight: 16,
                  objectFit: "cover",
                  border: "1px solid #eee"
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{app.name}</h3>
                <p style={{ margin: "6px 0", color: "#555" }}>
                  {app.instructions}
                </p>
                <p style={{ fontWeight: "bold" }}>
                  🎁 Reward: {app.rewardCoins} Coins
                </p>
              </div>
            </div>

            {/* STATUS */}
            {status && (
              <div style={{ marginTop: 12 }}>
                {status === "pending" && (
                  <span style={badgeStyle("#facc15")}>⏳ Pending</span>
                )}
                {status === "approved" && (
                  <span style={badgeStyle("#22c55e")}>✅ Approved</span>
                )}
                {status === "rejected" && (
                  <span style={badgeStyle("#ef4444")}>❌ Rejected</span>
                )}
              </div>
            )}

            {/* ACTION BUTTONS */}
            {!status && (
              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button style={primaryBtn} onClick={() => handleInstall(app)}>
                  Install App
                </button>
                <button style={secondaryBtn} onClick={() => handleCompleteClick(app)}>
                  Complete Task
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* MODAL FORM */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={{ marginBottom: 10 }}>📝 Submit Task</h3>
            <p><b>{selectedApp?.name}</b></p>

            <input
              type="email"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <input
              type="tel"
              placeholder="Registered Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={inputStyle}
            />

            <button style={{ ...primaryBtn, width: "100%" }} onClick={handleSubmitTask}>
              Submit Task
            </button>

            <button
              style={{ ...secondaryBtn, width: "100%", marginTop: 10 }}
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== STYLES ===== */

const primaryBtn = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer"
};

const secondaryBtn = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #2563eb",
  background: "#fff",
  color: "#2563eb",
  fontWeight: "bold",
  cursor: "pointer"
};

const badgeStyle = (bg) => ({
  background: bg,
  color: "#000",
  padding: "6px 12px",
  borderRadius: 20,
  fontWeight: "bold",
  display: "inline-block"
});

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalBox = {
  background: "#fff",
  padding: 24,
  borderRadius: 16,
  width: "90%",
  maxWidth: 420
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ccc"
};

export default AppInstallPage;