import { NavLink } from "react-router-dom";
import "./BottomBar.css";

export default function BottomBar() {
  return (
    <div className="bottom-bar">
      <NavLink to="/">🏠 Home</NavLink>
      <NavLink to="/tasks">📋 Tasks</NavLink>
      <NavLink to="/withdraw">💸 Withdraw</NavLink>
      <NavLink to="/refer">👥 Refer</NavLink>
      <NavLink to="/support">🎧 Support</NavLink>
    </div>
  );
}