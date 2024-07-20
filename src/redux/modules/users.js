import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export const fetchUsers = createAsyncThunk("fetchUsers", async () => {
  const byID = {};
  const byEmail = {};

  await getDocs(collection(db, "users")).then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      const tmp = { ...doc.data(), id: doc.id };
      tmp.created = tmp.created.toJSON();

      byID[doc.id] = tmp;
      byEmail[tmp.email] = doc.id;
    });
  });

  return {
    byID: byID,
    byEmail: byEmail,
  };
});

const usersSlice = createSlice({
  name: "users",
  initialState: {
    byID: {},
    byEmail: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action) => (state = action.payload)
    );
  },
});

export default usersSlice.reducer;
