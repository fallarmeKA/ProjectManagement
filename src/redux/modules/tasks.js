import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchTasks = createAsyncThunk("fetchTasks", async () => {
  const byID = {};
  const byProject = {};
  const byUserID = {};

  await getDocs(collection(db, "tasks")).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      const tmp = { ...doc.data(), id: doc.id };
      tmp.created = tmp.created.toJSON();
      tmp.start = tmp.start.toJSON();
      tmp.end = tmp.end.toJSON();

      byID[doc.id] = tmp;

      if (byProject[tmp.projectID] == null) byProject[tmp.projectID] = [];
      byProject[tmp.projectID].push(doc.id);

      if (byUserID[tmp.assignedID] == null) byUserID[tmp.assignedID] = [];
      byUserID[tmp.assignedID].push(doc.id);
    });
  });

  return {
    byID: byID,
    byProject: byProject,
    byUserID: byUserID,
  };
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    byID: {},
    byProject: {},
    byUserID: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchTasks.fulfilled,
      (state, action) => (state = action.payload)
    );
  },
});

export default tasksSlice.reducer;
