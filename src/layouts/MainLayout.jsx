import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function MainLayout() {
  return (
    <>
      <Header />

      <div style={{ paddingBottom: 70 }}>
        <Outlet />
      </div>

      <BottomNav />
    </>
  );
}