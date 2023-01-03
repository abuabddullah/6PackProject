import { createSlice } from "@reduxjs/toolkit";
import {
  getMyProfile,
  loginUser,
  logoutMe,
  registerNewUser,
} from "./userActions";

const initialState = {
  userInfo: {},
  error: null,
  loading: false,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    clearUserErrors: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* * for login purpose * */
    // Do something while pending if you want.
    builder.addCase(loginUser.pending, (state, action) => {
      state.loading = true;
      state.isAuthenticated = false;
    });
    // Do something when passes.
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    });
    // Do something if fails.
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    });

    /* * for registerUser purpose * */
    // Do something while pending if you want.
    builder.addCase(registerNewUser.pending, (state, action) => {
      state.loading = true;
      state.isAuthenticated = false;
    });
    // Do something when passes.
    builder.addCase(registerNewUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    });
    // Do something if fails.
    builder.addCase(registerNewUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    });

    /* * for getMyProfile purpose * */
    // Do something while pending if you want.
    builder.addCase(getMyProfile.pending, (state, action) => {
      state.loading = true;
      state.isAuthenticated = false;
    });
    // Do something when passes.
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      if (typeof action.payload === "string") {
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        return;
      } else {
        state.loading = false;
        state.isAuthenticated = true;
        state.userInfo = action.payload;
      }
    });
    // Do something if fails.
    builder.addCase(getMyProfile.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    });

    /* * for logoutMe purpose * */
    // for logout purpose we don't need to do anything while pending.
    // Do something when passes.
    builder.addCase(logoutMe.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
    });
    // Do something if fails.
    builder.addCase(logoutMe.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    });
  },
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;
