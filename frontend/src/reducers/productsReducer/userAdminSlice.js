import { createSlice } from "@reduxjs/toolkit";
import { fetchAdminAllUsers } from "./userAdminAction";

const initialState = {
  loading: false,
  users: [],
  error: null,
};

const userAdminSlice = createSlice({
  name: "userAdmin",
  initialState,
  reducers: {
    clearUserAdminErrors: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* * for fetchAdminAllUsers purpose * */
    // Do something while pending if you want.
    builder.addCase(fetchAdminAllUsers.pending, (state, action) => {
      state.loading = true;
    });
    // Do something when passes.
    builder.addCase(fetchAdminAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    // Do something if fails.
    builder.addCase(fetchAdminAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.users = [];
      state.error = action.payload;
    });
  },
});

export const { clearUserAdminErrors } = userAdminSlice.actions;

export default userAdminSlice.reducer;

