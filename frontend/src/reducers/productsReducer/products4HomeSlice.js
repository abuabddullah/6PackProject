import {createSlice} from '@reduxjs/toolkit';
import { fetchAllProductsAtHome } from './productsActions';

const products4HomeSlice = createSlice({
    name: 'products',
    initialState: {
        productsCount: 0,
        products: [],
        error: null,
        isLoading: false,
    },
    reducers: {
        clearFetchAllProducts4HomeErrors: (state, action) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllProductsAtHome.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAllProductsAtHome.fulfilled, (state, action) => {
            state.resultPerPage = action.payload.resultPerPage;
            state.productsCount = action.payload.productsCount;
            state.products = action.payload.products;
            state.isLoading = false;
        });
        builder.addCase(fetchAllProductsAtHome.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });
    }

});

export const { clearFetchAllProducts4HomeErrors} = products4HomeSlice.actions;
export default products4HomeSlice.reducer;