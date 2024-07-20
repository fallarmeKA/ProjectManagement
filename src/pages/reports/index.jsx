import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import BarChart from "../../components/charts/bar-chart";
import DonutChart from "../../components/charts/donut-chart";
import PageHeader from "../../components/page-header";
import ProjectSelector from "../../components/project-selector";
import TasksTable from "../../components/tasks-table";
import { getDefaultChartStatuses } from "../../constants/generics";
import { fetchProjects } from "../../redux/modules/projects";
import { fetchTasks } from "../../redux/modules/tasks";
import { fetchUsers } from "../../redux/modules/users";
import { setDocumentTitle } from "../../utils/document-title";
import { tasksFilterRemaining } from "../../utils/task-filter";
import "./index.css";

export default function ReportsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects);
  const tasks = useSelector((state) => state.tasks);
  const users = useSelector((state) => state.users);

  const [selectedProjectID, setSelectedProjectID] = useState("");
  const [donutValues, setDonutValues] = useState([]);

  const { projectID } = useParams();

  const setProject = (projectID) => {
    if (projectID) navigate(`/reports/${projectID}`);
    else navigate("/reports");
  };

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    if (Object.keys(projects).length > 0) {
      if (projects[projectID] == null) navigate("/reports");
      else setSelectedProjectID(projectID);
    }
  }, [projects]);

  useEffect(() => {
    setSelectedProjectID(projectID == null ? "" : projectID);
  }, [projectID]);

  useEffect(() => {
    if (Object.keys(projects).length > 0) {
      if (selectedProjectID) setDocumentTitle(projects[selectedProjectID].name);
      else setDocumentTitle("Reports");
    } else setDocumentTitle("Reports");
  }, [projects, selectedProjectID]);

  useEffect(() => {
    let statuses = getDefaultChartStatuses();

    tasks.byProject[selectedProjectID]?.forEach(
      (taskID) => statuses[tasks.byID[taskID].status].value++
    );

    setDonutValues([
      statuses.incomplete,
      statuses["in progress"],
      statuses.complete,
    ]);
  }, [selectedProjectID, projects, tasks]);

  return (
    <>
      <PageHeader title="Reports" subtitle="Welcome to your reports!" />

      <ProjectSelector
        selectedProjectID={selectedProjectID}
        setSelectedProjectID={setProject}
        extraStyles={{
          marginBottom: "1rem",
        }}
      />

      <div className={`reports-wrapper ${selectedProjectID ? "show" : ""}`}>
        <div
          className="remaining-tasks-container"
          style={{
            gridArea: "table",
          }}
        >
          <h2 className="title">Remaining tasks</h2>

          <TasksTable
            tasks={tasks}
            taskIDs={
              tasks.byProject[selectedProjectID] != null
                ? tasks.byProject[selectedProjectID].filter((taskID) =>
                    tasksFilterRemaining(tasks, taskID)
                  )
                : []
            }
            users={users}
          />
        </div>

        <DonutChart
          title="Tasks by status"
          titlePosition="top-center"
          values={donutValues}
          showLegends={true}
          extraStyles={{ gridArea: "donut" }}
        />

        <BarChart
          title="Tasks by status"
          titlePosition="top-center"
          values={donutValues}
          step={2}
          showLegends={true}
          extraStyles={{ gridArea: "bar" }}
        />
      </div>
    </>
  );
}
