import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Timetable from "../../components/charts/timetable";
import PageHeader from "../../components/page-header";
import ProjectSelector from "../../components/project-selector";
import { fetchProjects } from "../../redux/modules/projects";
import { fetchTasks } from "../../redux/modules/tasks";
import { setDocumentTitle } from "../../utils/document-title";
import { projectSorter } from "../../utils/project-sorter";
import { taskSorter } from "../../utils/task-sorter";
import "./index.css";

export default function TimetablePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects);
  const tasks = useSelector((state) => state.tasks);

  const [selectedProjectID, setSelectedProjectID] = useState("");

  const { projectID } = useParams();

  const setProject = (projectID) => {
    if (projectID) navigate(`/timetable/${projectID}`);
    else navigate("/timetable");
  };

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, []);

  useEffect(() => {
    if (Object.keys(projects).length > 0) {
      if (projects[projectID] == null) navigate("/timetable");
      else setSelectedProjectID(projectID);
    }
  }, [projects]);

  useEffect(() => {
    setSelectedProjectID(projectID == null ? "" : projectID);
  }, [projectID]);

  useEffect(() => {
    if (Object.keys(projects).length > 0) {
      if (selectedProjectID) setDocumentTitle(projects[selectedProjectID].name);
      else setDocumentTitle("Timetable");
    } else setDocumentTitle("Timetable");
  }, [projects, selectedProjectID]);

  return (
    <>
      <PageHeader title="Timetable" subtitle="See all tasks here." />

      <Timetable
        title="All Projects"
        items={Object.keys(projects)
          .map((projectID) => projects[projectID])
          .sort(projectSorter)
          .map((project) => ({
            id: project.id,
            color: project.color,
            name: project.name,
            start: project.start,
            end: project.end,
          }))}
      />

      <ProjectSelector
        selectedProjectID={selectedProjectID}
        setSelectedProjectID={setProject}
        extraStyles={{
          margin: "1rem 0",
        }}
      />

      <Timetable
        title={projects[selectedProjectID]?.name}
        items={
          tasks.byProject[selectedProjectID]
            ? [...tasks.byProject[selectedProjectID]]
                .sort((taskIDA, taskIDB) => taskSorter(tasks, taskIDA, taskIDB))
                .map((taskID) => tasks.byID[taskID])
                .map((task) => ({
                  id: task.id,
                  color: task.color,
                  name: task.name,
                  start: task.start,
                  end: task.end,
                }))
            : []
        }
        show={selectedProjectID}
      />
    </>
  );
}
