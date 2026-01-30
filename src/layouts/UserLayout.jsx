import { Outlet } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import BottomBar from "../components/BottomBar";

export default function UserLayout() {
  return (
    <>
      <TopHeader />

      <div style={{ paddingTop: 56, paddingBottom: 64 }}>
        <Outlet />
      </div>

      <BottomBar />
    </>
  );
}