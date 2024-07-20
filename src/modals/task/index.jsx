import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalLayout from "../../layouts/modal";
import { addTask, deleteTask, updateTask } from "../../services/task";
import { setDocumentTitle } from "../../utils/document-title";
import {
  getDateFromTimestamp,
  getStringFromDate,
} from "../../utils/timestamp-date";
import { notify } from "../../utils/toast";
import "./../index.css";

export default function TaskModal({ activeModal, setActiveModal, task }) {
  const currentUser = useSelector((state) => state.user);
  const projects = useSelector((state) => state.projects);
  const tasks = useSelector((state) => state.tasks);
  const users = useSelector((state) => state.users);

  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [projectID, setProjectID] = useState("");
  const [assignedID, setAssignedID] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState("#40D473");
  const [status, setStatus] = useState("incomplete");

  const onSubmit = async (event) => {
    event.preventDefault();

    if (id) {
      notify.info("Saving task...");
      const updated = await updateTask(id, {
        ...task,
        name: name,
        projectID: projectID,
        assignedID: assignedID,
        description: description,
        created: new Timestamp(
          task.created.seconds,
          task.created.nanoseconds
        ).toDate(),
        start: new Date(start),
        end: new Date(end),
        color: color,
        status: status,
      });

      if (updated == null) notify.error("Error saving task.");
      else {
        notify.success("Sucessfully saved task!");
        setActiveModal(false);
      }
    } else {
      notify.info("Creating task...");
      const task = await addTask(
        name,
        projectID,
        assignedID,
        description,
        new Date(start),
        new Date(end),
        color,
        status
      );

      if (task == null) notify.error("Error creating task.");
      else {
        notify.success("Successfully created task!");
        setActiveModal(false);
      }
    }
  };

  const onDelete = async (event) => {
    event.preventDefault();
    notify.info("Deleting task...");
    const success = await deleteTask(id);

    if (success) {
      notify.success("Successfully deleted task!");
      setActiveModal(false);
    } else notify.error("Error deleting task.");
  };

  useEffect(() => {
    if (activeModal === "task") {
      if (task) {
        setDocumentTitle("Edit task");

        setID(task.id);
        setName(task.name);
        setProjectID(task.projectID);
        setAssignedID(task.assignedID);
        setDescription(task.description);
        setStart(getStringFromDate(getDateFromTimestamp(task.start)));
        setEnd(getStringFromDate(getDateFromTimestamp(task.end)));
        setColor(task.color);
        setStatus(task.status);
      } else {
        setDocumentTitle("Add new task");

        setID("");
        setName("");
        setProjectID("");
        setAssignedID("");
        setDescription("");
        setStart("");
        setEnd("");
        setColor("#40D473");
        setStatus("incomplete");
      }
    }
  }, [activeModal]);

  return (
    <ModalLayout active={activeModal === "task"} setActive={setActiveModal}>
      <form onSubmit={onSubmit} className="form">
        <h2 className="title">{id ? "Edit task" : "Add new task"}</h2>

        <div className="field-cols-container">
          <div className="col">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="field"
              type="text"
              value={name}
              onInput={(event) => setName(event.target.value)}
            />

            <label className="label" htmlFor="project">
              Project
            </label>
            <select
              id="project"
              className="field"
              value={projectID}
              onChange={(event) => setProjectID(event.target.value)}
            >
              <option value=""></option>
              {Object.keys(projects).map((projectID) => (
                <option key={`project-${projectID}`} value={projectID}>
                  {projects[projectID].name}
                </option>
              ))}
            </select>

            <label className="label" htmlFor="assigned">
              Assigned
            </label>
            <select
              id="assigned"
              className="field"
              value={assignedID}
              onChange={(event) => setAssignedID(event.target.value)}
            >
              <option value=""></option>
              {Object.keys(users.byID).map((userID) => (
                <option key={`user-${userID}`} value={userID}>
                  {users.byID[userID].name} ({users.byID[userID].email})
                </option>
              ))}
            </select>

            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="field"
              value={description}
              rows={6}
              onInput={(event) => setDescription(event.target.value)}
            ></textarea>
          </div>

          <div className="col">
            <label className="label" htmlFor="start">
              Start
            </label>
            <input
              id="start"
              className="field"
              type="date"
              value={start}
              onInput={(event) => setStart(event.target.value)}
            />

            <label className="label" htmlFor="end">
              End
            </label>
            <input
              id="end"
              className="field"
              type="date"
              value={end}
              onInput={(event) => setEnd(event.target.value)}
            />

            <label className="label" htmlFor="color">
              Color
            </label>
            <input
              id="color"
              className="field"
              type="color"
              value={color}
              onInput={(event) => setColor(event.target.value)}
            />

            <label className="label" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              className="field"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="incomplete">Incomplete</option>
              <option value="in progress">In Progress</option>
              <option value="complete">Complete</option>
            </select>

            <input
              className="button"
              type="submit"
              value={id ? "Save Task" : "Add Task"}
              disabled={
                !(
                  name &&
                  projectID &&
                  assignedID &&
                  description &&
                  start &&
                  end &&
                  start <= end &&
                  color &&
                  status
                ) ||
                !(id
                  ? currentUser.permissions.tasks.others.edit ||
                    projects[projectID].projectManagerID ===
                      currentUser.userID ||
                    tasks.byID[id].assignedID === currentUser.userID
                  : currentUser.permissions.tasks.create)
              }
            />

            {id && (
              <input
                className="button"
                type="button"
                onClick={onDelete}
                value="Delete Task"
                disabled={!currentUser.permissions.tasks.delete}
              />
            )}
          </div>
        </div>
      </form>
    </ModalLayout>
  );
}
