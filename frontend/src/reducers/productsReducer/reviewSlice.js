import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  createReview,
  deleteReviewById,
  getAllReviewsOfProductById,
} from "./reviewActions";

const initialState = {
  loading: false,
  error: null,
  reviews: [],
  success: false,
  message: "",
};

const reviewSlice = createSlice({
  name: "reviewInfo",
  initialState,
  reducers: {
    clearReviewErrors: (state, action) => {
      state.error = null;
    },
    resetReview: (state, action) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // create review
    builder.addCase(createReview.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createReview.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
      toast.success("reviewing succeed", { id: "reviewing_success" });
    });
    builder.addCase(createReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      toast.error("reviewing failed", { id: "reviewing_err" });
    });

    // get all review of a product
    builder.addCase(getAllReviewsOfProductById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllReviewsOfProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.reviews = action.payload.reviews;
      state.message = action.payload.message;
      toast.success("getAllReviews succeed", { id: "getAllReviews_success" });
    });
    builder.addCase(getAllReviewsOfProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      toast.error("getAllReviews failed", { id: "getAllReviews_err" });
    });

    // deleteReviewById
    builder.addCase(deleteReviewById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteReviewById.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
      toast.success("deleteReviewById succeed", {
        id: "deleteReviewById_success",
      });
    });
    builder.addCase(deleteReviewById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      toast.error("deleteReviewById failed", { id: "deleteReviewById_err" });
    });
  },
});

export const { clearReviewErrors, resetReview } = reviewSlice.actions;

export default reviewSlice.reducer;
