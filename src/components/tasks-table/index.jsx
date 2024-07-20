import { taskSorter } from "../../utils/task-sorter";
import { getDateFromTimestamp } from "../../utils/timestamp-date";
import "./index.css";

export default function TasksTable({
  tasks,
  taskIDs,
  users,
  allowEditTasks = false,
  currentUser = null,
  projectManagerID = "",
  setActiveTask = () => {},
  setActiveModal = () => {},
}) {
  return (
    <div className="tasks-table-container">
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Assigned</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {taskIDs.length > 0 ? (
            [...taskIDs]
              .sort((taskIDA, taskIDB) => taskSorter(tasks, taskIDA, taskIDB))
              .map((taskID) => (
                <tr key={`project-task-${taskID}`}>
                  <td>
                    {allowEditTasks &&
                    currentUser &&
                    (currentUser.permissions.tasks.others.edit ||
                      projectManagerID === currentUser.userID ||
                      tasks.byID[taskID].assignedID === currentUser.userID) ? (
                      <span
                        className="allow-edit"
                        onClick={() => {
                          setActiveTask(tasks.byID[taskID]);
                          setActiveModal("task");
                        }}
                      >
                        {tasks.byID[taskID].name}
                      </span>
                    ) : (
                      <span>{tasks.byID[taskID].name}</span>
                    )}
                  </td>

                  <td>{users.byID[tasks.byID[taskID].assignedID]?.name}</td>

                  <td>
                    {getDateFromTimestamp(
                      tasks.byID[taskID].start
                    ).toDateString()}
                  </td>

                  <td>
                    {getDateFromTimestamp(
                      tasks.byID[taskID].end
                    ).toDateString()}
                  </td>

                  <td>{tasks.byID[taskID].status}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={5}>No tasks found!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
