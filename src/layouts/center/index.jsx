import { Outlet } from "react-router-dom";
import "./index.css";

export default function CenterLayout() {
  return (
    <div className="center-layout">
      <Outlet />
    </div>
  );
}
