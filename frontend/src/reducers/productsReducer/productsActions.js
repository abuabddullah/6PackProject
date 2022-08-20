import { createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";



// export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async () => {
//     const { data } = await axios.get("http://localhost:5000/api/v1/products");
//     return data;
// })

export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async (keyWord="") => {
    try {
        const { data } = await axios.get(`http://localhost:5000/api/v1/products?keyword=${keyWord}`);
        return data;
    } catch (err) {
        return err.message;
    }
})



export const fetchProductById = createAsyncThunk("productDetails/fetchProductById", async (id) => {
    try {
        const { data } = await axios
        .get(`http://localhost:5000/api/v1/product/${id}`);
        return data.product;
    } catch (err) {
        return err.message;
    }
})