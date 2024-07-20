/**
 *
 * @param {string} title
 */
export const setDocumentTitle = (title) => {
  document.title = `${title.length > 0 ? title + " | " : ""}Project Management`;
};
