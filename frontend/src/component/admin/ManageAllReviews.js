import { Button } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import PageTitle from "../layout/PageTitle/PageTitle";
import Star from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteReviewById,
  getAllReviewsOfProductById,
} from "../../reducers/productsReducer/reviewActions";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import {
  clearReviewErrors,
  resetDeleteReview,
} from "../../reducers/productsReducer/reviewSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageAllReviews = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, loading, reviews, isDeleteReview } = useSelector(
    (state) => state.review
  );

  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReviewById({ reviewId, productId }));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviewsOfProductById(productId));
  };

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviewsOfProductById(productId));
    }
    if (error) {
      toast.error("Admin All Reviews error", { id: "AdminAllReviews_err" });
      dispatch(clearReviewErrors());
    }

    if (isDeleteReview) {
      // toast.success("Admin All Reviews success", {
      //   id: "AdminAllReviews_success",
      // });
      dispatch(getAllReviewsOfProductById(productId));
      navigate("/admin/dashboard/reviews");
      dispatch(resetDeleteReview());
    }
  }, [dispatch, error, isDeleteReview, navigate, productId]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,

      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Button
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  return (
    <Fragment>
      <PageTitle title={"All Reviews - Dashboard"} />

      <div className="productReviewsContainer">
        <form
          className="productReviewsForm"
          onSubmit={productReviewsSubmitHandler}
        >
          <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

          <div>
            <Star />
            <input
              type="text"
              placeholder="Product Id"
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <Button
            id="createProductBtn"
            type="submit"
            disabled={loading ? true : false || productId === "" ? true : false}
          >
            Search
          </Button>
        </form>

        {reviews && reviews.length > 0 ? (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        ) : (
          <h1 className="productReviewsFormHeading">No Reviews Found</h1>
        )}
      </div>
    </Fragment>
  );
};

export default ManageAllReviews;
