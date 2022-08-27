import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./../reducers/productsReducer/productsSlice";
import productDetailsReducer from "./../reducers/productsReducer/singleProductSlice";
import products4HomeReducer from "./../reducers/productsReducer/products4HomeSlice";
const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        products4Home: products4HomeReducer,
    },
})

export default store;