import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUserProfile = createAsyncThunk(
  "user/updateUserInfo",
  async (userProfileData, { rejectWithValue }) => {
    try {
      // get token from cookie and send via get request
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      const token = getCookie("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "https://sixpackproject-qnef.onrender.comapi/v1/me/update",
        userProfileData,
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "user/updateUserPassword",
  async (userPasswordsData, { rejectWithValue }) => {
    try {
      // get token from cookie and send via get request
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      const token = getCookie("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "https://sixpackproject-qnef.onrender.comapi/v1/password/update",
        userPasswordsData,
        config
      );

      // saving token in coockie for 5 days
      document.cookie = `token=${data.token}; expires=${new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      )}; path=/`;

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const forgotUserPassword = createAsyncThunk(
  "user/forgotUserPassword",
  async (userMailingInfo, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "https://sixpackproject-qnef.onrender.comapi/v1/password/forgot",
        userMailingInfo,
        config
      );

      return data; // data={success: true, message: "Email sent"}
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "user/resetUserPassword",
  async (userData, { rejectWithValue }) => {
    // use rest operator to seperate token from userData and remove it from userData
    const { token, ...userPasswordsData } = userData;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `https://sixpackproject-qnef.onrender.comapi/v1/password/reset/${token}`,
        userPasswordsData,
        config
      );
      // saving token in coockie for 5 days
      document.cookie = `token=${data.token}; expires=${new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      )}; path=/`;

      return data; // data={success: true,token,user,}
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
