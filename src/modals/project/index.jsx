import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ModalLayout from "../../layouts/modal";
import {
  addProject,
  deleteProject,
  updateProject,
} from "../../services/project";
import { setDocumentTitle } from "../../utils/document-title";
import {
  getDateFromTimestamp,
  getStringFromDate,
} from "../../utils/timestamp-date";
import { notify } from "../../utils/toast";
import "./../index.css";

export default function ProjectModal({ activeModal, setActiveModal, project }) {
  const currentUser = useSelector((state) => state.user);
  const projects = useSelector((state) => state.projects);
  const users = useSelector((state) => state.users);

  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState("#40D473");
  const [status, setStatus] = useState("incomplete");

  const onSubmit = async (event) => {
    event.preventDefault();

    if (id) {
      notify.info("Saving project...");
      const updated = await updateProject(id, {
        ...project,
        name: name,
        projectManagerID: projectManager,
        description: description,
        created: new Timestamp(
          project.created.seconds,
          project.created.nanoseconds
        ).toDate(),
        start: new Date(start),
        end: new Date(end),
        color: color,
        status: status,
      });

      if (updated == null) notify.error("Error saving project.");
      else {
        notify.success("Sucessfully saved project!");
        setActiveModal(false);
      }
    } else {
      notify.info("Creating project...");
      const project = await addProject(
        name,
        projectManager,
        description,
        new Date(start),
        new Date(end),
        color,
        status
      );

      if (project == null) notify.error("Error creating project.");
      else {
        notify.success("Successfully created project!");
        setActiveModal(false);
      }
    }
  };

  const onDelete = async (event) => {
    event.preventDefault();
    notify.info("Deleting project...");
    const success = await deleteProject(id);

    if (success) {
      notify.success("Successfully deleted project!");
      setActiveModal(false);
    } else notify.error("Error deleting project.");
  };

  useEffect(() => {
    if (activeModal === "project") {
      if (project) {
        setDocumentTitle("Edit project");

        setID(project.id);
        setName(project.name);
        setProjectManager(project.projectManagerID);
        setDescription(project.description);
        setStart(getStringFromDate(getDateFromTimestamp(project.start)));
        setEnd(getStringFromDate(getDateFromTimestamp(project.end)));
        setColor(project.color);
        setStatus(project.status);
      } else {
        setDocumentTitle("Add new project");

        setID("");
        setName("");
        setProjectManager("");
        setDescription("");
        setStart("");
        setEnd("");
        setColor("#40D473");
        setStatus("incomplete");
      }
    }
  }, [activeModal]);

  return (
    <ModalLayout active={activeModal === "project"} setActive={setActiveModal}>
      <form onSubmit={onSubmit} className="form">
        <h2 className="title">{id ? "Edit project" : "Add new project"}</h2>

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

            <label className="label" htmlFor="manager">
              Project manager
            </label>
            <select
              id="manager"
              className="field"
              value={projectManager}
              onChange={(event) => setProjectManager(event.target.value)}
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
              value={id ? "Save Project" : "Add Project"}
              disabled={
                !(
                  name &&
                  projectManager &&
                  description &&
                  start &&
                  end &&
                  start <= end &&
                  color &&
                  status
                ) ||
                !(id
                  ? currentUser.permissions.projects.others.edit ||
                    projects[id].projectManagerID === currentUser.userID
                  : currentUser.permissions.projects.create)
              }
            />

            {id && (
              <input
                className="button"
                type="button"
                onClick={onDelete}
                value="Delete Project"
                disabled={!currentUser.permissions.projects.delete}
              />
            )}
          </div>
        </div>
      </form>
    </ModalLayout>
  );
}
