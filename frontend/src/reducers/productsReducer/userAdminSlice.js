import { createSlice } from "@reduxjs/toolkit";
import {
  deleteAdminUserById,
  fetchAdminAllUsers,
  getUserDetailsByAdminById,
  updateUserByAdminById,
} from "./userAdminAction";

const initialState = {
  loading: false,
  users: [],
  error: null,
  message: null,
  isUserDeleted: false,
  user: {},
  isUpdated: false,
  userDetailsById: {},
  userDetailsByIdLoading: false,
  userDetailsByIdError: null,
};

const userAdminSlice = createSlice({
  name: "userAdmin",
  initialState,
  reducers: {
    clearUserAdminErrors: (state, action) => {
      state.error = null;
    },
    resetDeleteUser: (state, action) => {
      state.isUserDeleted = false;
    },
    resetUpdateUser: (state, action) => {
      state.isUpdated = false;
    },
    clearGetUserByIdErrors: (state, action) => {
      state.userDetailsByIdError = null;
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

    /* deleteAdminUserById */
    builder.addCase(deleteAdminUserById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteAdminUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.isUserDeleted = action.payload.success;
      state.message = action.payload.message;
    });
    builder.addCase(deleteAdminUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    /* updateUserByAdminById */
    builder.addCase(updateUserByAdminById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateUserByAdminById.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = action.payload.success;
      state.message = action.payload.message;
    });
    builder.addCase(updateUserByAdminById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    /* getUserDetailsByAdminById */
    builder.addCase(getUserDetailsByAdminById.pending, (state, action) => {
      state.userDetailsByIdLoading = true;
    });
    builder.addCase(getUserDetailsByAdminById.fulfilled, (state, action) => {
      state.userDetailsByIdLoading = false;
      state.userDetailsById = action.payload.user;
    });
    builder.addCase(getUserDetailsByAdminById.rejected, (state, action) => {
      state.userDetailsByIdLoading = false;
      state.userDetailsByIdError = action.payload;
    });
  },
});

export const { clearUserAdminErrors, resetDeleteUser, resetUpdateUser,clearGetUserByIdErrors } =
  userAdminSlice.actions;

export default userAdminSlice.reducer;
