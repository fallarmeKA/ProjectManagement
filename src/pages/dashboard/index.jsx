import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BarChart from "../../components/charts/bar-chart";
import DonutChart from "../../components/charts/donut-chart";
import Timetable from "../../components/charts/timetable";
import PageHeader from "../../components/page-header";
import { getDefaultChartStatuses } from "../../constants/generics";
import { fetchProjects } from "../../redux/modules/projects";
import { fetchTasks } from "../../redux/modules/tasks";
import { setDocumentTitle } from "../../utils/document-title";
import { projectSorter } from "../../utils/project-sorter";
import "./index.css";

export default function DashboardPage() {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects);
  const tasks = useSelector((state) => state.tasks);

  const [projectDonutValues, setProjectDonutValues] = useState([]);
  const [taskDonutValues, setTaskDonutValues] = useState([]);

  useEffect(() => {
    setDocumentTitle("Dashboard");

    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, []);

  useEffect(() => {
    let statuses = getDefaultChartStatuses();

    if (Object.keys(projects).length > 0) {
      Object.keys(projects).forEach(
        (projectID) => statuses[projects[projectID].status].value++
      );
    }

    setProjectDonutValues([
      statuses.incomplete,
      statuses["in progress"],
      statuses.complete,
    ]);
  }, [projects]);

  useEffect(() => {
    let statuses = getDefaultChartStatuses();

    if (Object.keys(tasks.byID).length > 0) {
      Object.keys(tasks.byID).forEach(
        (taskID) => statuses[tasks.byID[taskID].status].value++
      );
    }

    setTaskDonutValues([
      statuses.incomplete,
      statuses["in progress"],
      statuses.complete,
    ]);
  }, [tasks]);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Welcome to your dashboard!" />

      <div className="dashboard-wrapper">
        <DonutChart
          title="All Projects by status"
          titlePosition="top-center"
          values={projectDonutValues}
          showLegends={true}
        />

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

        <DonutChart
          title="All Tasks by status"
          titlePosition="top-center"
          values={taskDonutValues}
          showLegends={true}
        />

        <BarChart
          title="All Tasks by status"
          titlePosition="top-center"
          values={taskDonutValues}
          step={2}
          showLegends={true}
        />
      </div>
    </>
  );
}
