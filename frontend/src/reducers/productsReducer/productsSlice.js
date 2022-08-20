import {createSlice} from '@reduxjs/toolkit';
import { fetchAllProducts } from './productsActions';

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        resultPerPage: 0,
        productsCount: 0,
        products: [],
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
            state.resultPerPage = action.payload.resultPerPage;
            state.productsCount = action.payload.productsCount;
            state.products = action.payload.products;
            state.isLoading = false;
        });
        builder.addCase(fetchAllProducts.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });
    }

});

export const { clearFetchAllProductsErrors} = productsSlice.actions;
export default productsSlice.reducer;