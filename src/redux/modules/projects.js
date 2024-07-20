import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchProjects = createAsyncThunk("fetchProjects", async () => {
  const projects = {};

  await getDocs(collection(db, "projects")).then((snapshot) =>
    snapshot.docs.forEach((doc) => {
      let tmp = { ...doc.data(), id: doc.id };
      tmp.created = tmp.created.toJSON();
      tmp.start = tmp.start.toJSON();
      tmp.end = tmp.end.toJSON();

      projects[doc.id] = tmp;
    })
  );

  return projects;
});

const projectsSlice = createSlice({
  name: "projects",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchProjects.fulfilled,
      (state, action) => (state = action.payload)
    );
  },
});

export default projectsSlice.reducer;
