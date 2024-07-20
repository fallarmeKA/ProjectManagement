import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./modules/projects";
import tasksReducer from "./modules/tasks";
import userReducer from "./modules/user-permissions";
import usersReducer from "./modules/users";

export const store = configureStore({
  reducer: {
    user: userReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    users: usersReducer,
  },
});
