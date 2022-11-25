// import { createSlice } from "@reduxjs/toolkit";
// import { fetchAllProducts } from "./productsActions";

// const productsSlice = createSlice({
//   name: "products",
//   initialState: {
//     productsCount: 0,
//     products: [],
//     error: null,
//     isLoading: false,
//   },
//   reducers: {
//     clearFetchAllProductsErrors: (state, action) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(fetchAllProducts.pending, (state, action) => {
//       state.isLoading = true;
//     });
//     builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
//       state.limit = action.payload?.limit; // this line is no of use now cause in the tutorial limit was imported from backend but in our project we exported it from frontend to backend
//       state.productsCount = action.payload.productsCount;
//       state.products = action.payload.products;
//       state.isLoading = false;
//     });
//     builder.addCase(fetchAllProducts.rejected, (state, action) => {
//       state.error = action.payload;
//       state.isLoading = false;
//     });
//   },
// });

// export const { clearFetchAllProductsErrors } = productsSlice.actions;
// export default productsSlice.reducer;







import { createSlice } from "@reduxjs/toolkit";
import { fetchAllProducts } from "./productsActions";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    productsCount: 0,
    products: [],
    filteredProductsCount: 0,
    error: null,
    isLoading: false,
  },
  reducers: {
    clearFetchAllProductsErrors: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.limit = action.payload?.limit; // this line is no of use now cause in the tutorial limit was imported from backend but in our project we exported it from frontend to backend
      state.productsCount = action.payload.productsCount;
      state.products = action.payload.products;
      state.isLoading = false;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });
  },
});

export const { clearFetchAllProductsErrors } = productsSlice.actions;
export default productsSlice.reducer;
