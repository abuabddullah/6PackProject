import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./../reducers/productsReducer/productsSlice";
import productDetailsReducer from "./../reducers/productsReducer/singleProductSlice";
const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
    },
})

export default store;