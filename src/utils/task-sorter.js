const statusValues = {
  incomplete: 1,
  "in progress": 2,
  complete: 3,
};

/**
 *
 * @param {TasksState} tasks State
 * @param {string} taskIDA
 * @param {string} taskIDB
 * @returns
 */
export const taskSorter = (tasks, taskIDA, taskIDB) => {
  const taskA = tasks.byID[taskIDA];
  const taskB = tasks.byID[taskIDB];

  return (
    taskA.end.seconds - taskB.end.seconds ||
    taskA.end.nanoseconds - taskB.end.nanoseconds ||
    taskA.start.seconds - taskB.start.seconds ||
    taskA.start.nanoseconds - taskB.start.nanoseconds ||
    statusValues[taskA.status] - statusValues[taskB.status] ||
    taskA.name.localeCompare(taskB.name)
  );
};
