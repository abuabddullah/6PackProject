import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const fetchAllProducts = createAsyncThunk("products/fetchAllProducts", async () => {
//     const { data } = await axios.get("http://localhost:5000/api/v1/products");
//     return data;
// })

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async ({
    keyWord = "",
    page = 1,
    limit = 3,
    price = [0, 25000],
    ratings = 0,
    category,
  }) => {
    try {
      let link = `http://localhost:5000/api/v1/products?keyword=${keyWord}&page=${page}&limit=${limit}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

      if (category && category !== "All") {
        link += `&category=${category}`;
      }
      const { data } = await axios.get(link);
      return data;
    } catch (err) {
      return err.message;
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  "products/fetchAdminProducts",
  async () => {
    try {
      // get token from cookie and send via get request
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      const token = getCookie("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/admin/products",
        config
      );
      return data; // { success: true, products,}
    } catch (err) {
      return err.message;
    }
  }
);

export const deleteAdminProductById = createAsyncThunk(
  "products/deleteAdminProductById",
  async (id) => {
    try {
      // get token from cookie and send via get request
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      const token = getCookie("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      };
      const { data } = await axios.delete(
        `http://localhost:5000/api/v1/admin/product/${id}`,
        config
      );
      return data; // {success: true,message: "Product deleted",}
    } catch (err) {
      return err.message;
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "productDetails/fetchProductById",
  async (id) => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/product/${id}`
      );
      return data.product;
    } catch (err) {
      return err.message;
    }
  }
);

/* createNewProductByAdmin */
export const createNewProductByAdmin = createAsyncThunk(
  "products/createNewProductByAdmin",
  async (product) => {
    try {
      // get token from cookie and send via get request
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      const token = getCookie("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/admin/product/new",
        product,
        config
      );
      return data; // {success: true,product,}
    } catch (err) {
      return err.message;
    }
  }
);
