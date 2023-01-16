import { createSlice } from "@reduxjs/toolkit";
import { getStripePublishableApiKey, process4Payment } from "./paymentActions";

const initialState = {
  error: null,
  loading: false,
  stripePublishableApiKey: null,
  client_secret: null,
};

const paymentSlice = createSlice({
  name: "paymentInfo",
  initialState,
  reducers: {
    clearPaymentErrors: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* * for getStripePublishableApiKey purpose * */
    // Do something while pending if you want.
    builder.addCase(getStripePublishableApiKey.pending, (state, action) => {
      state.loading = true;
    });
    // Do something when passes.
    builder.addCase(getStripePublishableApiKey.fulfilled, (state, action) => {
      state.loading = false;
      state.stripePublishableApiKey = action.payload;
    });
    // Do something if fails.
    builder.addCase(getStripePublishableApiKey.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    /* * for process4Payment purpose * */
    // Do something while pending if you want.
    builder.addCase(process4Payment.pending, (state, action) => {
      state.loading = true;
    });
    // Do something when passes.
    builder.addCase(process4Payment.fulfilled, (state, action) => {
      state.loading = false;
      state.client_secret = action.payload.client_secret;
    });
    // Do something if fails.
    builder.addCase(process4Payment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearPaymentErrors } = paymentSlice.actions;
export default paymentSlice.reducer;
