// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const loginUser = createAsyncThunk(
//   "user/loginUser",
//   async (userInfo, { rejectWithValue }) => {
//     try {
//       const config = { headers: { "Content-Type": "application/json" } };
//       const { data } = await axios.post(
//         "https://sixpackproject-qnef.onrender.comapi/v1/login",
//         userInfo,
//         config
//       );
//       return data.user;
//     } catch (err) {
//       return rejectWithValue(err.response.data.message);
//     }
//   }
// );

// export const registerNewUser = createAsyncThunk(
//   "user/registerNewUser",
//   async (userData, { rejectWithValue }) => {
//     try {
//       const config = { headers: { "Content-Type": "multipart/form-data" } };
//       const { data } = await axios.post(
//         "https://sixpackproject-qnef.onrender.comapi/v1/register",
//         userData,
//         config
//       );
//       return data.user;
//     } catch (err) {
//       return rejectWithValue(err.response.data.message);
//     }
//   }
// );

/* =========================
         fixing cookie not saving issue
============================*/

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userInfo, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "https://sixpackproject-qnef.onrender.comapi/v1/login",
        userInfo,
        config
      );

      // saving token in coockie for 5 days
      document.cookie = `token=${data.token}; expires=${new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      )}; path=/`;

      return data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const registerNewUser = createAsyncThunk(
  "user/registerNewUser",
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(
        "https://sixpackproject-qnef.onrender.comapi/v1/register",
        userData,
        config
      );

      // saving token in coockie for 5 days
      document.cookie = `token=${data.token}; expires=${new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      )}; path=/`;

      return data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getMyProfile = createAsyncThunk("user/getMyProfile", async () => {
  try {
    // get token from cookie and send via get request
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const token = getCookie("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get("https://sixpackproject-qnef.onrender.comapi/v1/me", config);

    return data.user;
  } catch (err) {
    return err.response.data.message;
  }
});

export const logoutMe = createAsyncThunk("user/logoutMe", async () => {
  try {
    // remove token from cookie
    const removingCookieByName = "token";
    document.cookie = removingCookieByName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    await axios.get("https://sixpackproject-qnef.onrender.comapi/v1/logout");
  } catch (err) {
    return err.response.data.message;
  }
});
