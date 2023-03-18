import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createOrder, fetchAdminAllOrders, getOrderDetailsById, myOrders } from "./orderActions";

const initialState = {
  loading: false,
  error: null,
  orders: [],
  newOrder: {},
  orderDetailsById: {},
  isOrderUpdated: false,
  isOrderDeleted: false,
  message: null,
};

const orderSlice = createSlice({
  // name: "cart",
  name: "orderInfo",
  initialState,
  reducers: {
    clearOrderErrors: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // create order
    builder.addCase(createOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.newOrder = action.payload.order;
      state.message = action.payload.message;
      toast.success("ordering succeed", { id: "ordering_success" });
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error("ordering failed", { id: "ordering_err" });
    });

    // get my orders
    builder.addCase(myOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(myOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
    });
    builder.addCase(myOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // getOrderDetailsById
    builder.addCase(getOrderDetailsById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getOrderDetailsById.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetailsById = action.payload.order;
    });
    builder.addCase(getOrderDetailsById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // getAdminAllOrders
    builder.addCase(fetchAdminAllOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchAdminAllOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
    });
    builder.addCase(fetchAdminAllOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearOrderErrors } = orderSlice.actions;

export default orderSlice.reducer;
