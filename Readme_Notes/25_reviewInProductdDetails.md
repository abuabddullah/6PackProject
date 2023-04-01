# Enable Reviewing in SingleOrderDetails.js

## 1. create reviewSlice.js

```http
path: frontend\src\reducers\productsReducer\reviewSlice.js
""""""""""""""""""""""""""""

import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  createReview,
  deleteReviewById,
  getAllReviewsOfProductById,
} from "./reviewActions";

const initialState = {
  loading: false,
  error: null,
  reviews: [],
  success: false,
  message: "",
};

const reviewSlice = createSlice({
  name: "reviewInfo",
  initialState,
  reducers: {
    clearReviewErrors: (state, action) => {
      state.error = null;
    },
    resetReview: (state, action) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // create review
    builder.addCase(createReview.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createReview.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
      toast.success("reviewing succeed", { id: "reviewing_success" });
    });
    builder.addCase(createReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      toast.error("reviewing failed", { id: "reviewing_err" });
    });

    // get all review of a product
    builder.addCase(getAllReviewsOfProductById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAllReviewsOfProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.reviews = action.payload.reviews;
      state.message = action.payload.message;
      toast.success("getAllReviews succeed", { id: "getAllReviews_success" });
    });
    builder.addCase(getAllReviewsOfProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      toast.error("getAllReviews failed", { id: "getAllReviews_err" });
    });

    // deleteReviewById
    builder.addCase(deleteReviewById.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteReviewById.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.success;
      state.message = action.payload.message;
      toast.success("deleteReviewById succeed", {
        id: "deleteReviewById_success",
      });
    });
    builder.addCase(deleteReviewById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      toast.error("deleteReviewById failed", { id: "deleteReviewById_err" });
    });
  },
});

export const { clearReviewErrors, resetReview } = reviewSlice.actions;

export default reviewSlice.reducer;


```

## 2. create reviewActions.js

```http
path: frontend\src\reducers\productsReducer\reviewActions.js
""""""""""""""""""""""""""""

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
        "https://sixpackproject.onrender.comapi/v1/review",
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
        `https://sixpackproject.onrender.comapi/v1/reviews?id=${id}`
      );

      return data; // {success: true,message: "Product review done successfully",product}
    } catch (err) {
      return err.response.data.message;
    }
  }
);

export const deleteReviewById = createAsyncThunk(
  "user/deleteReviewById",
  async (reviewId, productId) => {
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
        `https://sixpackproject.onrender.comapi/v1/reviews?id=${reviewId}&productId=${productId}`,
        config
      );

      return data; // {success: true,message: "Product review deleted successfully",product}
    } catch (err) {
      return err.response.data.message;
    }
  }
);


```

## 3. add modal(dialouge) and react rating in SingleProductDetails.js

> > mui **dialouge** এর সাথে কিছু fixed componnt এবং কিছু useStateVar নিতে হয় যা আমরা নিয়েছি
> > মজার বিষয় হচ্ছে mui **Rating** এ by default 5 টা star থাকে যেখানে প্রতিটার ভিতরে value দেয়া থাকে তাই click করলেই তার value পাওয়া যায় সহজেই
> > **_reviewSubmitHandler_** function এর ভিতরে আমরা review related যেই যেই data backend এ পাঠাতে চাই তা **_createReview_** reducer function এর সাহায্যে পাঠাতে পারি যা একটা **put** request এর মাধ্যমে তা করে থাকে

```http
path: frontend\src\component\Product\SingleProductDetails.js
""""""""""""""""""""""""""""

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../reducers/productsReducer/productsActions";
import "./SingleProductDetails.css";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import Carousel from "react-material-ui-carousel";
import ReactStars from "react-rating-stars-component";
import { toast } from "react-toastify";
import { addToCart } from "../../reducers/productsReducer/cartSlice";
import { createReview } from "../../reducers/productsReducer/reviewActions";
import {
  clearReviewErrors,
  resetReview,
} from "../../reducers/productsReducer/reviewSlice";
import { clearFetchSingleProductErrors } from "../../reducers/productsReducer/singleProductSlice";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";
import ReviewCard from "./ReviewCard.js";

const SingleProductDetails = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading, error } = useSelector(
    (store) => store.productDetails
  );
  const [quantity, setQuantity] = useState(1);

  // review related
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const {
    loading,
    error: reviewError,
    success,
  } = useSelector((store) => store.review);

  const increaseQty = () => {
    if (quantity >= product.Stock) return;
    const qty4cart = quantity + 1;
    setQuantity(qty4cart);
  };
  const decreaseQty = () => {
    if (quantity <= 1) return;
    const qty4cart = quantity - 1;
    setQuantity(qty4cart);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", _id);

    dispatch(createReview(myForm));

    setOpen(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "fetchProductById_error" });
      dispatch(clearFetchSingleProductErrors());
    }

    if (reviewError) {
      toast.error(reviewError, { id: "reviewError_error" });
      dispatch(clearReviewErrors());
    }

    if (success) {
      toast.success(success, { id: "review_success" });
      dispatch(resetReview());
    }
    dispatch(fetchProductById(_id));
  }, [dispatch, _id, error, reviewError, success]);

  const options = {
    count: 5,
    value: product.ratings,
    edit: false,
    size: window.innerWidth < 768 ? 12 : 20,
    isHalf: true,
    activeColor: "#eb4034",
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={`${product.name}`} />
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQty}>-</button>
                    <input readOnly type="number" value={quantity} />{" "}
                    {/* readOnly defend cursor blinking & type editing */}
                    <button onClick={increaseQty}>+</button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.Stock < 1 ? true : false}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={() => setOpen(!open)} className="submitReview">
                Submit Review
              </button>
            </div>
          </div>

          {/* modal for submitting review */}

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={() => setOpen(!open)}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => setRating(e.target.value)}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(!open)} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          <h3 className="reviewsHeading">REVIEWS</h3>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </>
      )}
    </>
  );
};

export default SingleProductDetails;



```
