import { Timestamp } from "firebase/firestore";

/**
 *
 * @param {TasksState} tasks
 * @param {string} taskID
 * @returns boolean
 */
export const tasksFilterRemaining = (tasks, taskID) => {
  const now = Timestamp.fromDate(new Date());

  if (
    tasks.byID[taskID].end.seconds < now.seconds &&
    tasks.byID[taskID].status != "complete"
  )
    return true;

  return (
    tasks.byID[taskID].end.seconds >= now.seconds &&
    tasks.byID[taskID].status != "complete"
  );
};
