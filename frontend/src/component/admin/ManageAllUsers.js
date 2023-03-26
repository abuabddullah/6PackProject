import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@mui/material";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../layout/PageTitle/PageTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteAdminUserById,
  fetchAdminAllUsers,
} from "../../reducers/productsReducer/userAdminAction";
import {
  clearUserAdminErrors,
  resetDeleteUser,
} from "../../reducers/productsReducer/userAdminSlice";
import { toast } from "react-toastify";

const ManageAllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, users, loading, isUserDeleted, message } = useSelector(
    (state) => state.userAdmin
  );

  const deleteUserHandler = (id) => {
    dispatch(deleteAdminUserById(id));
  };
  useEffect(() => {
    if (error) {
      toast.error("Admin All Users error", { id: "AdminAllUsers_err" });
      dispatch(clearUserAdminErrors());
    }

    if (isUserDeleted) {
      toast.success("User Deleted Successfully", {
        id: "UserDeleted_success",
      });
      navigate("/admin/dashboard/users");
      dispatch(resetDeleteUser());
    }

    dispatch(fetchAdminAllUsers());
  }, [dispatch, error, isUserDeleted, navigate]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
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
            <Link className="exactCenter" to={`/admin/dashboard/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
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

  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });
  return (
    <Fragment>
      <PageTitle title={"All Users - Dashboard"} />
      <div className="productListContainer">
        <h1 id="productListHeading">ALL USERS</h1>

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

export default ManageAllUsers;
