import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAdminAllUsers = createAsyncThunk(
  "admin/fetchAdminAllUsers",
  async (userInfo, { rejectWithValue }) => {
    try {
      // get token from cookie and send via get request
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      const token = getCookie("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/admin/users",
        config
      );
      return data.users; // data={success: true,users,}
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const deleteAdminUserById = createAsyncThunk(
  "products/deleteAdminUserById",
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
        `http://localhost:5000/api/v1/admin/user/${id}`,
        config
      );
      return data; // {success: true,message: "user deleted successfully",}
    } catch (err) {
      return err.message;
    }
  }
);

/* updateUserByAdminById */
export const updateUserByAdminById = createAsyncThunk(
  "admin/updateUserByAdminById",
  async ({ id, myForm }) => {
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
        `http://localhost:5000/api/v1/admin/user/${id}`,
        myForm,
        config
      );
      return data; // {success: true,message: "user role updated successfully",user,}
    } catch (err) {
      return err.message;
    }
  }
);

/* getUserDetailsByAdminById */
export const getUserDetailsByAdminById = createAsyncThunk(
  "admin/getUserDetailsByAdminById",
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
      const { data } = await axios.get(
        `http://localhost:5000/api/v1/admin/user/${id}`,
        config
      );
      return data; // {success: true,user,}
    } catch (err) {
      return err.message;
    }
  }
);
