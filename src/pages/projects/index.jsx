import { Add } from "iconsax-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/page-header";
import TasksTable from "../../components/tasks-table";
import ProjectModal from "../../modals/project";
import TaskModal from "../../modals/task";
import { fetchProjects } from "../../redux/modules/projects";
import { fetchTasks } from "../../redux/modules/tasks";
import { fetchUsers } from "../../redux/modules/users";
import { setDocumentTitle } from "../../utils/document-title";
import { getDateFromTimestamp } from "../../utils/timestamp-date";
import "./index.css";

export default function ProjectsPage() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user);
  const projects = useSelector((state) => state.projects);
  const tasks = useSelector((state) => state.tasks);
  const users = useSelector((state) => state.users);

  const [activeProject, setActiveProject] = useState();
  const [activeTask, setActiveTask] = useState();
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (!activeModal) {
      setDocumentTitle("Projects");
      setActiveProject(undefined);
      setActiveTask(undefined);

      dispatch(fetchProjects());
      dispatch(fetchTasks());
      dispatch(fetchUsers());
    }
  }, [activeModal]);

  return (
    <>
      <PageHeader title="Projects" subtitle="Welcome to your projects!" />

      {(currentUser.permissions.projects.create ||
        currentUser.permissions.tasks.create) && (
        <div className="add-buttons-row">
          {currentUser.permissions.projects.create && (
            <button
              className="button add"
              onClick={() => setActiveModal("project")}
            >
              <Add size="1.5rem" /> Add Project
            </button>
          )}

          {currentUser.permissions.tasks.create && (
            <button
              className="button add"
              onClick={() => setActiveModal("task")}
            >
              <Add size="1.5rem" /> Add Deliverable
            </button>
          )}
        </div>
      )}

      <div className="projects-container">
        {Object.keys(projects).map((projectID) => (
          <div key={`project-${projectID}`} className="project">
            <div className="title-row">
              <div className="title-container">
                <div
                  className="circle"
                  style={{
                    backgroundColor: projects[projectID].color,
                  }}
                />
                <h2 className="title">{projects[projectID].name}</h2>{" "}
                <span>({projects[projectID].status})</span>
              </div>

              {(currentUser.permissions.projects.edit ||
                currentUser.permissions.projects.others.edit ||
                projects[projectID].projectManagerID ===
                  currentUser.userID) && (
                <button
                  className="button edit"
                  onClick={() => {
                    setActiveModal("project");
                    setActiveProject(projects[projectID]);
                  }}
                >
                  Edit
                </button>
              )}
            </div>

            <p>
              <strong>Project Manager:</strong>{" "}
              {users.byID[projects[projectID].projectManagerID]?.name}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {getDateFromTimestamp(projects[projectID].start).toDateString()}{" "}
              to {getDateFromTimestamp(projects[projectID].end).toDateString()}
            </p>

            <p>{projects[projectID].description}</p>

            <TasksTable
              tasks={tasks}
              taskIDs={
                tasks.byProject[projectID] != null
                  ? tasks.byProject[projectID]
                  : []
              }
              users={users}
              allowEditTasks={true}
              currentUser={currentUser}
              projectManagerID={projects[projectID].projectManagerID}
              setActiveTask={setActiveTask}
              setActiveModal={setActiveModal}
            />
          </div>
        ))}
      </div>

      <ProjectModal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        project={activeProject}
      />

      <TaskModal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        task={activeTask}
      />
    </>
  );
}
