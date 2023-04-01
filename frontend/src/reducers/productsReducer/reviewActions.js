import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createReview = createAsyncThunk(
  "user/createNewReview",
  async (review) => {
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
        "https://sixpackproject-qnef.onrender.comapi/v1/review",
        review,
        config
      );

      return data; // {success: true,message: "Product review done successfully",product}
    } catch (err) {
      return err.response.data.message;
    }
  }
);

export const getAllReviewsOfProductById = createAsyncThunk(
  "user/getAllReviewsOfProductById",
  async (id) => {
    try {
      const { data } = await axios.get(
        `https://sixpackproject-qnef.onrender.comapi/v1/reviews?id=${id}`
      );

      return data; // {success: true,message: "Product review done successfully",product}
    } catch (err) {
      return err.response.data.message;
    }
  }
);

export const deleteReviewById = createAsyncThunk(
  "user/deleteReviewById",
  async ({reviewId, productId}) => {
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
        `https://sixpackproject-qnef.onrender.comapi/v1/reviews?id=${reviewId}&productId=${productId}`,
        config
      );

      return data; // {success: true,message: "Product review deleted successfully",product}
    } catch (err) {
      return err.response.data.message;
    }
  }
);
