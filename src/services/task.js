import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const addTask = async (
  name,
  projectID,
  assignedID,
  description,
  start,
  end,
  color,
  status
) => {
  let task = {
    projectID: projectID,
    assignedID: assignedID,
    created: new Date(),
    start: start,
    end: end,
    name: name,
    description: description,
    color: color,
    status: status,
  };

  await addDoc(collection(db, "tasks"), task)
    .then((doc) => {
      task.id = doc.id;
      task.start = Timestamp.fromDate(start);
      task.end = Timestamp.fromDate(end);
    })
    .catch((error) => {
      console.error(error);
      task = null;
    });

  return task;
};

export const updateTask = async (taskID, task) => {
  delete task.id;
  let updated = null;

  await setDoc(doc(db, "tasks", taskID), task)
    .then(() => {
      updated = task;
    })
    .catch((error) => {
      console.error(error);
    });

  return updated;
};

export const deleteTask = async (taskID) => {
  let success = false;

  await deleteDoc(doc(db, "tasks", taskID))
    .then(() => {
      success = true;
    })
    .catch((error) => {
      console.error(error);
    });

  return success;
};
