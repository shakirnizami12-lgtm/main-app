import { useEffect } from "react";

export default function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 4000);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div style={styles.toast}>
      🔔 {message}
    </div>
  );
}

const styles = {
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#333",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 9999,
    animation: "slideIn 0.4s ease",
  },
};