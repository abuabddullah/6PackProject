import { configureStore } from "@reduxjs/toolkit";
import { products4HomeAPI } from "../reducers/productsReducer/products4HomeAPI";
import productsReducer from "./../reducers/productsReducer/productsSlice";
import userReducer from "./../reducers/productsReducer/userSlice";
import paymentReducer from "./../reducers/productsReducer/paymentSlice";
import userProfileReducer from "./../reducers/productsReducer/profileSlice";
import productDetailsReducer from "./../reducers/productsReducer/singleProductSlice";
import cartReducer from "./../reducers/productsReducer/cartSlice";
const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        userDetails: userReducer,
        userProfile: userProfileReducer,
        cart: cartReducer,
        payment: paymentReducer,
        [products4HomeAPI.reducerPath]: products4HomeAPI.reducer, // x
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(products4HomeAPI.middleware), // x
})

export default store;