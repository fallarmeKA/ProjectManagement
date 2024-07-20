import React, { useEffect, useState } from "react";
import "./index.css";

const TITLE_POSITION_SETTINGS = {
  "top-center": "text-center",
  "bottom-left": "text-left",
};

export default function DonutChart({
  title,
  titlePosition,
  values,
  showLegends = true,
  extraStyles = {},
}) {
  const [arcs, setArcs] = useState([]);

  useEffect(() => {
    let na = [];
    let sum = 0;
    let cmv = 0;

    values.forEach((value) => (sum += value.value));
    values.forEach((value, idx) => {
      const angle = (((cmv + value.value / 2) / sum) * 360 * Math.PI) / 180;

      na.push({
        value: value.value,
        valueX: 230 * Math.cos(angle),
        valueY: 230 * Math.sin(angle),
        color: value.color,
        dasharray:
          idx == 0
            ? `${value.value} ${sum}`
            : `0 ${cmv} ${value.value} ${sum - cmv - value.value}`,
        pathLength: sum,
      });

      cmv += value.value;
    });
    setArcs(na);
  }, [values]);

  return (
    <div className={`donut-chart ${titlePosition}`} style={{ ...extraStyles }}>
      <h2 className={`title ${titlePosition}`}>{title}</h2>

      <div className="chart-container">
        <svg
          width="32"
          height="32"
          viewBox="-270 -270 540 540"
          xmlns="http://www.w3.org/2000/svg"
        >
          {arcs.map((arc, idx) =>
            arc.value > 0 || idx == arcs.length - 1 ? (
              <React.Fragment key={`value-${idx}`}>
                <circle
                  r="160"
                  stroke={arc.color}
                  strokeWidth="40"
                  pathLength={arc.pathLength}
                  strokeDasharray={arc.dasharray}
                  fill="none"
                />
                <text
                  x={arc.valueX || 0}
                  y={arc.valueY || 0}
                  dominantBaseline="middle"
                  textAnchor="middle"
                >
                  {arc.value}
                </text>
              </React.Fragment>
            ) : null
          )}
        </svg>
      </div>

      <div className={`legends ${showLegends ? "show" : ""}`}>
        {values.map((value, idx) => (
          <div key={`legend-${idx}`} className="legend">
            <div
              className="circle"
              style={{
                backgroundColor: value.color,
              }}
            />
            <p className="text">{value.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
