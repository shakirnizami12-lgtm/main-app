import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function AdminProtectedRoute({ children }) {
  const { user } = useAuth();
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setAllowed(false);
        return;
      }

      const ref = doc(db, "admins", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().role === "admin") {
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    };

    checkAdmin();
  }, [user]);

  if (allowed === null) return null; // loading
  if (!allowed) return <Navigate to="/admin-login" replace />;

  return children;
}