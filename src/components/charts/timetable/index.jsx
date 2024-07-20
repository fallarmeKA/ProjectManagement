import { useEffect, useRef, useState } from "react";
import { MONTHS } from "../../../constants/generics";
import {
  getDateDifference,
  getDateFromTimestamp,
} from "../../../utils/timestamp-date";
import "./index.css";

export default function Timetable({ title, items, show = true }) {
  const [earliest, setEarliest] = useState(new Date());
  const [days, setDays] = useState([]);
  const [latest, setLatest] = useState(new Date());

  const datesRef = useRef(null);
  const namesRef = useRef(null);
  const gridRef = useRef(null);

  const onDatesScroll = () => {
    if (gridRef.current != null) {
      gridRef.current.scrollLeft = datesRef.current.scrollLeft;
    }
  };

  const onNamesScroll = () => {
    if (gridRef.current != null) {
      gridRef.current.scrollTop = namesRef.current.scrollTop;
    }
  };

  const onGridScroll = () => {
    if (datesRef.current != null) {
      datesRef.current.scrollLeft = gridRef.current.scrollLeft;
    }
    if (namesRef.current != null) {
      namesRef.current.scrollTop = gridRef.current.scrollTop;
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      setEarliest(getDateFromTimestamp(items[0].start));
      setLatest(getDateFromTimestamp(items[items.length - 1].end));

      let nd = [getDateFromTimestamp(items[0].start)];
      [
        ...Array(
          getDateDifference(
            getDateFromTimestamp(items[items.length - 1].end),
            getDateFromTimestamp(items[0].start)
          )
        ),
      ].forEach(() => {
        let next = new Date(nd[nd.length - 1]);
        next.setDate(next.getDate() + 1);
        nd.push(next);
      });
      setDays(nd);
    } else {
      setDays([]);
    }
  }, [items]);

  return (
    <div className={`timetable ${show ? "show" : ""}`}>
      <h2 className="title">{title}</h2>

      <div
        className="dates no-scrollbar"
        style={{
          gridTemplateColumns: `repeat(${
            getDateDifference(latest, earliest) + 1
          }, minmax(64px, 1fr))`,
        }}
        ref={datesRef}
        onScroll={onDatesScroll}
      >
        {days.map((date, idx) => (
          <p key={`date-${idx}`}>{`${
            idx === 0 || date.getDate() === 1
              ? MONTHS[date.getMonth()] + " "
              : ""
          }${date.getDate()}`}</p>
        ))}
      </div>

      <div
        className="names no-scrollbar"
        ref={namesRef}
        style={{
          scrollbarGutter: "stable both-edges",
        }}
        onScroll={onNamesScroll}
      >
        {items.map((item) => (
          <p key={`name-${item.id}`} className="name">
            {item.name}
          </p>
        ))}
      </div>

      <div
        className="grid no-scrollbar"
        style={{
          gridTemplateColumns: `repeat(${
            getDateDifference(latest, earliest) + 1
          }, minmax(64px, 1fr))`,
        }}
        ref={gridRef}
        onScroll={onGridScroll}
      >
        {items.map((item, idx) => (
          <div
            key={`cell-${item.id}`}
            className="cell"
            style={{
              backgroundColor: item.color,
              gridRow: `${idx + 1} / ${idx + 2}`,
              gridColumn: `${
                getDateDifference(getDateFromTimestamp(item.start), earliest) +
                1
              } / ${
                getDateDifference(getDateFromTimestamp(item.end), earliest) + 2
              }`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
