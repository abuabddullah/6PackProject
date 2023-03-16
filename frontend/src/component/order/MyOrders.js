import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { myOrders } from "../../reducers/productsReducer/orderActions";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";
import { Link } from "react-router-dom";
import LaunchIcon from '@mui/icons-material/Launch';
import { clearOrderErrors } from "../../reducers/productsReducer/orderSlice";
import { toast } from "react-toastify";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.userDetails);

  
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
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
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];

  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id, // here _id is the order's id
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {
    if (error) {
        toast.error("myOrdering failed", { id: "myOrdering_err" });
      dispatch(clearOrderErrors());
    }

    dispatch(myOrders());
  }, [dispatch, error]);

  return (
    <>
      <PageTitle title={`${userInfo.name}'s Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10} // number of rows per page
            disableSelectionOnClick // disable row selection
            className="myOrdersTable"
            autoHeight // auto height of table based on rows
          />

          <Typography id="myOrdersHeading">{userInfo.name}'s Orders</Typography>
        </div>
      )}
    </>
  );
};

export default MyOrders;
