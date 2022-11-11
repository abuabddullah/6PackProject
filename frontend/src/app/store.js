import { configureStore } from "@reduxjs/toolkit";
import { products4HomeAPI } from "../reducers/productsReducer/products4HomeAPI";
import productsReducer from "./../reducers/productsReducer/productsSlice";
import productDetailsReducer from "./../reducers/productsReducer/singleProductSlice";
const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        [products4HomeAPI.reducerPath]: products4HomeAPI.reducer, // x
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(products4HomeAPI.middleware), // x
})

export default store;