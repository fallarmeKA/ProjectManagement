import { Timestamp } from "firebase/firestore";

/**
 *
 * @param {SerializableTimestamp} timestamp
 * @returns Date
 */
export const getDateFromTimestamp = (timestamp) =>
  new Date(timestamp.seconds * 1000 + timestamp.nanoseconds);

/**
 *
 * @param {Date} date
 * @returns string
 */
export const getStringFromDate = (date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

/**
 *
 * @param {SerializableTimestamp} timestamp
 * @returns string
 */
export const getStringFromTimestamp = (timestamp) =>
  getStringFromDate(
    new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate()
  );

/**
 *
 * @param {Date} a
 * @param {Date} b
 * @returns number
 */
export const getDateDifference = (a, b) => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  return (
    Math.floor(
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) -
        Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
    ) / MS_PER_DAY
  );
};
