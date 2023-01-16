import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getStripePublishableApiKey = createAsyncThunk(
  "user/getStripePublishableApiKey",
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
        "http://localhost:5000/api/v1/stripePublishableApiKey",
        config
      );

      return data.stripePublishableApiKey;
    } catch (err) {
      return err.response.data.message;
    }
  }
);

export const process4Payment = createAsyncThunk(
  "user/process4Payment",
  async (paymentInSent) => {
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
        "http://localhost:5000/api/v1/payment/process",
        paymentInSent,
        config
      );

      console.log("process4Payment done", data);
      return data; // {success, client_secret}
    } catch (err) {
      return err.response.data.message;
    }
  }
);
