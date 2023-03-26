import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Button } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserDetailsByAdminById, updateUserByAdminById } from "../../reducers/productsReducer/userAdminAction";
import { clearGetUserByIdErrors, clearUserAdminErrors, resetUpdateUser } from "../../reducers/productsReducer/userAdminSlice";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    error,
    loading,
    isUpdated,
    userDetailsById:user,
    userDetailsByIdError,
  } = useSelector((state) => state.userAdmin);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUserByAdminById({id, myForm}));
  };

  useEffect(() => {
    if (user && user._id !== id) {
      dispatch(getUserDetailsByAdminById(id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (userDetailsByIdError) {
      toast.error("Admin Update User by id error", {
        id: "AdminUpdateUserById_err",
      });
      dispatch(clearGetUserByIdErrors());
    }
    if (error) {
      toast.error("user Update error", { id: "userUpdate_err" });
      dispatch(clearUserAdminErrors());
    }

    if (isUpdated) {
      toast.success("user Update success", { id: "userUpdate_success" });
      dispatch(getUserDetailsByAdminById(id));
      navigate("/admin/dashboard/users");
      dispatch(resetUpdateUser());
    }
  }, [dispatch, error, isUpdated, navigate, user, id, userDetailsByIdError]);

  return (
    <Fragment>
      <PageTitle title={"Update User Role - Dashboard"} />
      <div className="newProductContainer">
        {loading ? (
          <Loader />
        ) : (
          <form
            className="createProductForm"
            onSubmit={updateUserSubmitHandler}
          >
            <h1>Update User</h1>

            <div>
              <PersonIcon />
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <VerifiedUserIcon />
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Choose Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={
                loading ? true : false || role === "" ? true : false
              }
            >
              Update
            </Button>
          </form>
        )}
      </div>
    </Fragment>
  );
};

export default UpdateUser;
