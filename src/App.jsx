import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./firebase";
import CenterLayout from "./layouts/center";
import GeneralLayout from "./layouts/general";
import DashboardPage from "./pages/dashboard";
import ProjectsPage from "./pages/projects";
import ReportsPage from "./pages/reports";
import ResetPage from "./pages/reset";
import RootPage from "./pages/root";
import SignInPage from "./pages/signin";
import SignUpPage from "./pages/signup";
import TasksPage from "./pages/tasks";
import TimetablePage from "./pages/timetable";
import { fetchUser } from "./redux/modules/user-permissions";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) dispatch(fetchUser({ email: user.email }));
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<CenterLayout />}>
          <Route path="/" element={<RootPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset" element={<ResetPage />} />
        </Route>

        <Route element={<GeneralLayout />}>
          <Route path="/projects" element={<ProjectsPage />} />
        </Route>

        <Route element={<GeneralLayout isFullscreen={true} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/timetable/:projectID?" element={<TimetablePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/reports/:projectID?" element={<ReportsPage />} />
        </Route>

        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </>
  );
}
