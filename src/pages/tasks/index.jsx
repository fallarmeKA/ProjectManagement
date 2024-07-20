import { Add } from "iconsax-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/page-header";
import { auth } from "../../firebase";
import TaskModal from "../../modals/task";
import { fetchProjects } from "../../redux/modules/projects";
import { fetchTasks } from "../../redux/modules/tasks";
import { fetchUsers } from "../../redux/modules/users";
import { setDocumentTitle } from "../../utils/document-title";
import { taskSorter } from "../../utils/task-sorter";
import { getDateFromTimestamp } from "../../utils/timestamp-date";
import "./index.css";

export default function TasksPage() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user);
  const projects = useSelector((state) => state.projects);
  const tasks = useSelector((state) => state.tasks);
  const users = useSelector((state) => state.users);

  const [activeModal, setActiveModal] = useState(false);
  const [activeTask, setActiveTask] = useState();

  const statuses = [
    { status: "incomplete", text: "Incomplete" },
    { status: "in progress", text: "In Progress" },
    { status: "complete", text: "Complete" },
  ];

  useEffect(() => {
    if (!activeModal) {
      setDocumentTitle("My Tasks");
      setActiveTask(undefined);

      dispatch(fetchTasks());
      dispatch(fetchProjects());
      dispatch(fetchUsers());
    }
  }, [activeModal]);

  return (
    <>
      <PageHeader title="Tasks" subtitle="Welcome to your tasks!" />

      {currentUser.permissions.tasks.create && (
        <button className="button add" onClick={() => setActiveModal(true)}>
          <Add size="1.5rem" /> Add Task
        </button>
      )}

      <div className="tasks-board-wrapper">
        <div className="board">
          {statuses.map((status, idx) => (
            <div key={`board-col-${idx}`} className="column">
              <h2 className="title">{status.text}</h2>

              <div className="tasks-container">
                {auth.currentUser &&
                  Object.keys(users.byID).length > 0 &&
                  Object.keys(tasks.byID).length > 0 &&
                  tasks &&
                  tasks.byUserID[
                    users.byID[users.byEmail[auth.currentUser.email]].id
                  ] !== undefined &&
                  tasks.byUserID[
                    users.byID[users.byEmail[auth.currentUser.email]].id
                  ]
                    .filter(
                      (taskID) => tasks.byID[taskID].status == status.status
                    )
                    .sort((taskIDA, taskIDB) =>
                      taskSorter(tasks, taskIDA, taskIDB)
                    )
                    .map((taskID) => (
                      <div key={`task-${taskID}`} className="task">
                        <div className="title-row">
                          <h3 className="title-container">
                            <div
                              className="circle"
                              style={{
                                backgroundColor: tasks.byID[taskID].color,
                              }}
                            />
                            {tasks.byID[taskID].name}
                          </h3>

                          {currentUser.permissions.tasks.edit && (
                            <button
                              className="button edit"
                              onClick={() => {
                                setActiveModal(true);
                                setActiveTask(tasks.byID[taskID]);
                              }}
                            >
                              Edit
                            </button>
                          )}
                        </div>

                        <div className="project-tag">
                          <div
                            className="circle"
                            style={{
                              backgroundColor:
                                projects[tasks.byID[taskID].projectID]?.color,
                            }}
                          />
                          {projects[tasks.byID[taskID].projectID]?.name}
                        </div>

                        <p>
                          <strong>Duration:</strong>{" "}
                          {getDateFromTimestamp(
                            tasks.byID[taskID].start
                          ).toDateString()}{" "}
                          to{" "}
                          {getDateFromTimestamp(
                            tasks.byID[taskID].end
                          ).toDateString()}
                        </p>

                        <p>{tasks.byID[taskID].description}</p>
                      </div>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        activeModal={activeModal ? "task" : null}
        setActiveModal={setActiveModal}
        task={activeTask}
      />
    </>
  );
}
