import { DataGrid } from "@material-ui/data-grid";
import React, { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../layout/PageTitle/PageTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteAdminOrderById, fetchAdminAllOrders } from "../../reducers/productsReducer/orderActions";
import { clearOrderErrors, resetOrdersErrors } from "../../reducers/productsReducer/orderSlice";
import { toast } from "react-toastify";

const ManageAllOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  
  const { error, orders,isOrderDeleted } = useSelector((state) => state.order);
  

  const deleteOrderHandler = (id) => {
    dispatch(deleteAdminOrderById(id));
  };

  useEffect(() => {
    if (error) {
      toast.error("Admin All Orders error", { id: "AdminAllOrders_err" });
      dispatch(clearOrderErrors());
    }

    if (isOrderDeleted) {
      toast.success("Order Deleted Successfully", {
        id: "OrderDeleted_success",
      });
      dispatch(resetOrdersErrors());
      navigate("/admin/dashboard/orders");
    }

    dispatch(fetchAdminAllOrders()); // this is not needed because we are using the fetchAdminAllOrders action in the DashboardIndex component
  }, [dispatch, error, isOrderDeleted, navigate]);


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
      flex: 0.4,
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
          <Fragment>
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
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

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });
  return (
    <Fragment>
      <PageTitle title={"All Orders - Dashboard"} />

      <div className="productListContainer">
        <h1 id="productListHeading">ALL ORDERS</h1>

        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          className="productListTable"
          autoHeight
        />
      </div>
    </Fragment>
  );
};

export default ManageAllOrders;
