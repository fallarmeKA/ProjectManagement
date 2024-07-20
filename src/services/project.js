import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

export const addProject = async (
  name,
  projectManager,
  description,
  start,
  end,
  color,
  status
) => {
  let project = {
    projectManagerID: projectManager,
    created: new Date(),
    start: start,
    end: end,
    name: name,
    description: description,
    color: color,
    status: status,
  };

  await addDoc(collection(db, "projects"), project)
    .then((doc) => {
      project.id = doc.id;
      project.start = Timestamp.fromDate(project.start);
      project.end = Timestamp.fromDate(project.end);
    })
    .catch((error) => {
      console.error(error);
      project = null;
    });

  return project;
};

export const updateProject = async (projectID, project) => {
  delete project.id;
  let updated = null;

  await setDoc(doc(db, "projects", projectID), project)
    .then(() => {
      updated = project;
    })
    .catch((error) => {
      console.error(error);
    });

  return updated;
};

export const deleteProject = async (projectID) => {
  let success = false;

  await deleteDoc(doc(db, "projects", projectID))
    .then(() => {
      success = true;
    })
    .catch((error) => {
      console.error(error);
    });

  await getDocs(
    query(collection(db, "tasks"), where("projectID", "==", projectID))
  ).then((snapshot) => {
    snapshot.docs.forEach((document) =>
      deleteDoc(doc(db, "tasks", document.id))
    );
  });

  return success;
};
