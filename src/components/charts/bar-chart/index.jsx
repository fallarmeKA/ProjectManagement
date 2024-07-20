import { useEffect, useState } from "react";
import "./index.css";

export default function BarChart({
  title,
  titlePosition,
  values,
  step = 1,
  showLegends = true,
  extraStyles = {},
}) {
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    let mv = 0;
    values.forEach((value) => (mv = value.value > mv ? value.value : mv));
    setMaxValue(mv);
  }, [values]);

  return (
    <div className={`bar-chart ${titlePosition}`} style={{ ...extraStyles }}>
      <h2 className={`title ${titlePosition}`}>{title}</h2>

      <div className={`chart-container ${showLegends ? "show-legends" : ""}`}>
        {showLegends && (
          <div className="legend-values">
            <div>
              {[...Array(maxValue + 1)].map((_, idx) =>
                idx == 0 || (maxValue - idx) % step == 0 ? (
                  <span
                    key={`legend-value-${idx}`}
                    className="value"
                    style={{
                      top: `${(idx / maxValue) * 100}%`,
                    }}
                  >
                    {maxValue - idx}
                  </span>
                ) : null
              )}
            </div>
          </div>
        )}

        <div className="chart-legends-container">
          <div
            className="chart"
            style={{
              gridTemplateColumns: `repeat(${values.length}, 1fr)`,
            }}
          >
            {[...Array(maxValue)].map((_, idx) =>
              idx == 0 || (maxValue - idx) % step == 0 ? (
                <hr
                  key={`hr-${idx}`}
                  style={{
                    top: `${(idx / maxValue) * 100}%`,
                  }}
                />
              ) : null
            )}

            {values.map((value, idx) => (
              <div
                key={`bar-${idx}`}
                className="bar"
                style={{
                  backgroundColor: value.color,
                  height: `${(value.value / maxValue) * 100}%`,
                }}
              />
            ))}
          </div>

          <div
            className="legends"
            style={{
              gridTemplateColumns: `repeat(${values.length}, 1fr)`,
            }}
          >
            {values.map((value, idx) => (
              <span key={`legend-${idx}`} className="legend">
                {value.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
