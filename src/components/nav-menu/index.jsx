import {
  Chart2,
  Diagram,
  Element4,
  Graph,
  Setting,
  Sms,
  UserTag,
} from "iconsax-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import "./index.css";

export default function NavMenu() {
  const currentUser = useSelector((state) => state.user);

  const iconSize = "1.5rem";

  const navLinks = [
    {
      path: "/dashboard",
      icon: <Element4 size={iconSize} className="icon" />,
      text: "Dashboard",
    },
    {
      path: "/projects",
      icon: <Chart2 size={iconSize} className="icon" />,
      text: "Projects",
    },
    {
      path: "/timetable",
      icon: <Diagram size={iconSize} className="icon" />,
      text: "Timetable",
    },
    {
      path: "/tasks",
      icon: <Graph size={iconSize} className="icon" />,
      text: "My Tasks",
    },
    {
      path: "/reports",
      icon: <Sms size={iconSize} className="icon" />,
      text: "Reports",
    },
  ];

  return (
    <aside>
      <div className="nav-item no-pointer title">Project Management</div>

      <nav>
        {navLinks.map((link, idx) => (
          <Link to={link.path} key={`nav-link-${idx}`} className="nav-item">
            {link.icon} <span className="text">{link.text}</span>
          </Link>
        ))}

        <button onClick={() => auth.signOut()} className="nav-item">
          <Setting size={iconSize} className="icon" />{" "}
          <span className="text">Logout</span>
        </button>
      </nav>

      <div className="nav-item no-pointer">
        <UserTag size={iconSize} className="icon" />{" "}
        <span className="text">{currentUser.name}</span>
      </div>
    </aside>
  );
}
