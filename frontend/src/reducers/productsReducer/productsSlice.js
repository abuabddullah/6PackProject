import { createSlice } from "@reduxjs/toolkit";
import {
  createNewProductByAdmin,
  deleteAdminProductById,
  fetchAdminProducts,
  fetchAllProducts,
} from "./productsActions";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    productsCount: 0,
    products: [],
    newProduct: {},
    error: null,
    isLoading: false,
    isDeleted: false,
  },
  reducers: {
    clearFetchAllProductsErrors: (state, action) => {
      state.error = null;
    },
    resetDeleteProduct: (state, action) => {
      state.isDeleted = false;
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

    builder.addCase(fetchAdminProducts.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAdminProducts.fulfilled, (state, action) => {
      state.products = action.payload.products;
      state.isLoading = false;
    });
    builder.addCase(fetchAdminProducts.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });

    /* deleteAdminProductById */
    builder.addCase(deleteAdminProductById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(deleteAdminProductById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isDeleted = action.payload.success;
      // state.products = state.products.filter(
      //   (product) => product._id !== action.payload.productId
      // );
    });
    builder.addCase(deleteAdminProductById.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });

    /* createNewProductByAdmin */
    builder.addCase(createNewProductByAdmin.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createNewProductByAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newProduct = action.payload.product;
    });
    builder.addCase(createNewProductByAdmin.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });
  },
});

export const { clearFetchAllProductsErrors, resetDeleteProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
