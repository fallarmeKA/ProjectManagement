import { useSelector } from "react-redux";
import "./index.css";

export default function ProjectSelector({
  selectedProjectID,
  setSelectedProjectID,
  extraStyles,
}) {
  const projects = useSelector((state) => state.projects);

  return (
    <div className="project-selector" style={{ ...extraStyles }}>
      <label htmlFor="project">Select project:</label>

      <select
        id="project"
        value={selectedProjectID}
        onChange={(event) => setSelectedProjectID(event.target.value)}
      >
        <option value=""></option>
        {Object.keys(projects).map((projectID) => (
          <option key={`project-${projectID}`} value={projectID}>
            {projects[projectID].name}
          </option>
        ))}
      </select>
    </div>
  );
}
