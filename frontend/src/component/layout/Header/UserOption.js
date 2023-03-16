import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Backdrop, SpeedDial, SpeedDialAction } from "@mui/material";
import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutMe } from "../../../reducers/productsReducer/userActions";

const UserOption = ({ userInfo }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <ShoppingCartIcon />, name: "Cart", func: cart },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (userInfo?.role === "admin") {
    actions.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  /* declareing all the funcs of drop-down */

  function dashboard() {
    navigate("/admin/dashboard");
  }

  function orders() {
    navigate("/orders");
  }

  function cart() {
    navigate("/cart");
  }
  function account() {
    navigate("/account");
  }
  function logoutUser() {
    dispatch(logoutMe());
    toast.success("Logout Successfully", { id: "logoutUser" });
  }

  return (
    <Fragment>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        style={{ zIndex: "11" }}
        open={open}
        direction="down"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={userInfo?.avatar?.url ? userInfo.avatar.url : "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {actions.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
      <Backdrop open={open} style={{ zIndex: "10" }} />
    </Fragment>
  );
};

export default UserOption;
