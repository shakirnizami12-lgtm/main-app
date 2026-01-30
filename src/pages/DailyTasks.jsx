import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function DailyTasks() {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(null);

  const tasks = [
    {
      title: "Daily Check-in",
      subtitle: "Login bonus",
      reward: "+5 to +35 coins",
      icon: "📅",
      path: "/daily-checking",
    },
    {
      title: "Watch Ads",
      subtitle: "Quick earn",
      reward: "+10 coins",
      icon: "🎬",
      path: "/reward",
    },
    {
      title: "Spin & Win",
      subtitle: "Try your luck",
      reward: "Up to 50",
      icon: "🎡",
      path: "/spin",
    },
    {
      title: "Lottery",
      subtitle: "Big rewards",
      reward: "Jackpot",
      icon: "🎟️",
      path: "/lottery",
    },
    {
      title: "Install Apps",
      subtitle: "Install & earn",
      reward: "+30 coins",
      icon: "📲",
      path: "/app-install",
    },
    {
      title: "Quiz & Earn",
      subtitle: "Answer & earn",
      reward: "+20 coins",
      icon: "❓",
      path: "/quiz",
    },

    /* 🎁 MYSTERY BOX */
    {
      title: "Mystery Box",
      subtitle: "Watch ad & unlock",
      reward: "2–10 coins",
      icon: "🎁",
      path: "/mystery-box",
    },

    /* 🔢 NEW: NUMBER GUESS */
    {
      title: "Number Guess",
      subtitle: "Choose 1–5 & win",
      reward: "+5 coins",
      icon: "🔢",
      path: "/number-guess",
    },
  ];

  return (
    <div style={page}>
      <h2 style={heading}>Daily Tasks</h2>

      {tasks.map((t, i) => (
        <div
          key={i}
          style={{
            ...card,
            transform: pressed === i ? "scale(0.97)" : "scale(1)",
          }}
          onMouseDown={() => setPressed(i)}
          onMouseUp={() => setPressed(null)}
          onMouseLeave={() => setPressed(null)}
          onTouchStart={() => setPressed(i)}
          onTouchEnd={() => setPressed(null)}
          onClick={() => navigate(t.path)}
        >
          <div style={iconWrap}>{t.icon}</div>

          <div style={textWrap}>
            <div style={title}>{t.title}</div>
            <div style={subtitle}>{t.subtitle}</div>
          </div>

          <div style={rewardBadge}>{t.reward}</div>
        </div>
      ))}
    </div>
  );
}

/* 🔥 BIG CARD + ANIMATION PREMIUM STYLES */

const page = {
  padding: "16px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const heading = {
  fontSize: 20,
  fontWeight: 700,
  marginBottom: 16,
};

const card = {
  display: "flex",
  alignItems: "center",
  padding: "18px 16px",
  marginBottom: 14,
  borderRadius: 20,
  background: "linear-gradient(180deg, #ffffff, #f9fbff)",
  boxShadow: "0 14px 34px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
};

const iconWrap = {
  width: 60,
  height: 60,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 30,
  background: "rgba(14,165,233,0.14)",
  marginRight: 16,
};

const textWrap = {
  flex: 1,
};

const title = {
  fontSize: 16,
  fontWeight: 600,
};

const subtitle = {
  fontSize: 13,
  color: "#64748b",
  marginTop: 4,
};

const rewardBadge = {
  padding: "8px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  color: "#0369a1",
  background: "rgba(14,165,233,0.18)",
};