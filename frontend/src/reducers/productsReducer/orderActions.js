import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "user/createNewOrder",
  async (order) => {
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
        "https://sixpackproject.onrender.comapi/v1/order/new",
        order,
        config
      );

      return data; // {success: true,message: "order is created successfully",order,}
    } catch (err) {
      return err.response.data.message;
    }
  }
);

export const myOrders = createAsyncThunk("user/myOrders", async () => {
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
    };
    const { data } = await axios.get(
      "https://sixpackproject.onrender.comapi/v1/orders/me",
      config
    );
    return data; // {success: true,orders}
  } catch (err) {
    return err.response.data.message;
  }
});

export const getOrderDetailsById = createAsyncThunk(
  "user/getOrderDetailsById",
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
      };
      const { data } = await axios.get(
        `https://sixpackproject.onrender.comapi/v1/order/${id}`,
        config
      );
      return data; // {success: true,order}
    } catch (err) {
      return err.response.data.message;
    }
  }
);

export const fetchAdminAllOrders = createAsyncThunk(
  "admin/fetchAdminAllOrders",
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
      };
      const { data } = await axios.get(
        "https://sixpackproject.onrender.comapi/v1/admin/orders",
        config
      );
      return data; // {success: true,message: "All orders are fetched successfully",totalAmount,orders,}
    } catch (err) {
      return err.response.data.message;
    }
  }
);

export const deleteAdminOrderById = createAsyncThunk(
  "products/deleteAdminOrderById",
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
        `https://sixpackproject.onrender.comapi/v1/admin/order/${id}`,
        config
      );
      return data; // {success: true,message: "Order is deleted successfully",}
    } catch (err) {
      return err.message;
    }
  }
);


export const updateAdminOrderById = createAsyncThunk(
  "products/updateAdminOrderById",
  async ({id,myForm}) => {
    console.log(id,myForm);
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
      const { data } = await axios.put(
        `https://sixpackproject.onrender.comapi/v1/admin/order/${id}`,
        myForm,
        config
      );
      return data; // {success: true,message: "Order is updated successfully",order,}
    } catch (err) {
      return err.message;
    }
  }
);