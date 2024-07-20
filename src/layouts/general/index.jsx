import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavMenu from "../../components/nav-menu";
import { checkAuthStateChange } from "../../services/user";
import "./index.css";

export default function GeneralLayout({ isFullscreen = false }) {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStateChange(navigate);
  }, []);

  return (
    <div className="general-layout">
      <NavMenu />
      <div className={`content ${isFullscreen ? "fullscreen" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}
