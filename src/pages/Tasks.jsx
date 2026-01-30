import { useNavigate } from "react-router-dom";
import "./Tasks.css";

export default function Tasks() {
  const navigate = useNavigate();

  return (
    <div className="tasks-page">
      <h1>Daily Tasks</h1>

      <div className="task-grid">
        <div className="task-card" onClick={() => navigate("/daily-checkin")}>
          Daily Checking
        </div>

        <div className="task-card" onClick={() => navigate("/reward-ads")}>
          Reward Ads
        </div>

        <div className="task-card" onClick={() => navigate("/spin")}>
          Spin & Win
        </div>

        <div className="task-card" onClick={() => navigate("/lottery")}>
          Lottery Ticket
        </div>

        <div className="task-card" onClick={() => navigate("/app-install")}>
          App Install
        </div>

        <div className="task-card" onClick={() => navigate("/quiz")}>
          Quiz & Earn
        </div>
      </div>
    </div>
  );
}