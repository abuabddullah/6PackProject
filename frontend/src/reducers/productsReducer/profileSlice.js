import { createSlice } from "@reduxjs/toolkit";
import { updateUserPassword, updateUserProfile } from "./profileActions";

const initialState = {
    error: null,
    loading: false,
    isUpdatedUser: false,
    isDeletedUser: false,
    message: null,
  };

  const profileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
      clearUserProfileErrors: (state, action) => {
        state.error = null;
      },
      updateUserProfileReset: (state, action) => {
        state.isUpdatedUser = false;
      },
    },
    extraReducers: (builder) => {
      /* * for updateUserProfile purpose * */
      // Do something while pending if you want.
      builder.addCase(updateUserProfile.pending, (state, action) => {
        state.loading = true;
        state.isUpdatedUser = false;
      });
      // Do something when passes.
      builder.addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdatedUser = action.payload.success;
        state.message = action.payload.message;
      });
      // Do something if fails.
      builder.addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.isUpdatedUser = false;
        state.error = action.payload;
      });


      /* * for updateUserPassword purpose * */
      // Do something while pending if you want.
      builder.addCase(updateUserPassword.pending, (state, action) => {
        state.loading = true;
        state.isUpdatedUser = false;
      });
      // Do something when passes.
      builder.addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdatedUser = action.payload.success;
        state.message = action.payload.message;
      });
      // Do something if fails.
      builder.addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.isUpdatedUser = false;
        state.error = action.payload;
      });
    },
  });
  
  export const { clearUserProfileErrors,updateUserProfileReset } = profileSlice.actions;
  export default profileSlice.reducer;