const statusValues = {
  incomplete: 1,
  "in progress": 2,
  complete: 3,
};

/**
 * Sorts projects based on start, end, status, then name.
 * @param {Project} a Project A
 * @param {Project} b Project B
 * @returns number
 */
export const projectSorter = (a, b) =>
  a.start.seconds - b.start.seconds ||
  a.start.nanoseconds - b.start.nanoseconds ||
  a.end.seconds - b.end.seconds ||
  a.end.nanoseconds - b.end.nanoseconds ||
  statusValues[a.status] - statusValues[b.status] ||
  a.name.localeCompare(b.name);
