import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import permissions from "../../constants/permissions";
import { getUserByEmail } from "../../services/user";

const defaultState = {
  name: "User",
  userID: "",
  isAdmin: false,
  permissions: permissions.employee,
};

export const fetchUser = createAsyncThunk("fetchUser", async ({ email }) => {
  let newState = defaultState;

  if (email == null) return newState;
  else {
    let user = await getUserByEmail(email);
    if (user)
      newState = {
        name: user.name,
        userID: user.id,
        isAdmin: user.role === "admin",
        permissions:
          user.role === "admin" || user.role === "employee"
            ? permissions[user.role]
            : newState.permissions,
      };
  }

  return newState;
});

export const userSlice = createSlice({
  name: "user",
  initialState: { ...defaultState },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => (state = defaultState));

    builder.addCase(
      fetchUser.fulfilled,
      (state, action) => (state = action.payload)
    );
  },
});

export default userSlice.reducer;
