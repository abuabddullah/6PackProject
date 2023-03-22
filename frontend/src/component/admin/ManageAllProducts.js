import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteAdminProductById,
  fetchAllProducts,
} from "../../reducers/productsReducer/productsActions";
import {
  clearAllProductsErrors,
  resetDeleteProduct,
} from "../../reducers/productsReducer/productsSlice";
import PageTitle from "../layout/PageTitle/PageTitle";

const ManageAllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, products, isDeleted } = useSelector((state) => state.products);

  const deleteProductHandler = (id) => {
    dispatch(deleteAdminProductById(id));
  };

  useEffect(() => {
    if (error) {
      toast.error("Admin All products error", { id: "AdminAllProducts_err" });
      dispatch(clearAllProductsErrors());
    }

    if (isDeleted) {
      toast.success("Product Deleted Successfully", {
        id: "ProductDeleted_success",
      });
      dispatch(resetDeleteProduct());
      navigate("/admin/dashboard");
    }

    dispatch(fetchAllProducts()); // this is not needed because we are using the fetchAllProducts action in the AdminDashboardIndex component
  }, [dispatch, error, isDeleted, navigate]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
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
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
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

  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <PageTitle title={"All Products - Dashboard"} />

      <div className="productListContainer">
        <h1 id="productListHeading">ALL PRODUCTS</h1>

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

export default ManageAllProducts;
