import { createSlice } from '@reduxjs/toolkit';
import { fetchProductById } from './productsActions';

const singleProductSlice = createSlice({
    name: 'productDetails',
    initialState: {
        product: {},
        error: null,
        isLoading: false,
    },
    reducers: {
        clearFetchSingleProductErrors: (state, action) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductById.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(fetchProductById.fulfilled, (state, action) => {
            state.product = action.payload;
            state.isLoading = false;
        });
        builder.addCase(fetchProductById.rejected, (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        });
    }

});

export const { clearFetchSingleProductErrors } = singleProductSlice.actions;
export default singleProductSlice.reducer;