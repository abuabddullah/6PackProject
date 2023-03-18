import AddIcon from "@mui/icons-material/Add";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";

import { Link, Outlet } from "react-router-dom";
import PageTitle from "../layout/PageTitle/PageTitle";
export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    bottom: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem key={"Dashboard"} disablePadding>
          <Link to="/admin/dashboard">
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>

      <Divider />
      <List>
        <ListItem key={"All Products"} disablePadding>
          <Link to="/admin/dashboard/products">
            <ListItemButton>
              <ListItemIcon>
                <PostAddIcon />
              </ListItemIcon>
              <ListItemText primary={"All Products"} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      <List>
        <ListItem key={"Create Product"} disablePadding>
          <Link to="/admin/dashboard/product">
            <ListItemButton>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={"Create Product"} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>

      <Divider />
      <List>
        <ListItem key={"All Orders"} disablePadding>
          <Link to="/admin/dashboard/orders">
            <ListItemButton>
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary={"All Orders"} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>

      <Divider />
      <List>
        <ListItem key={"Users"} disablePadding>
          <Link to="/admin/dashboard/users">
            <ListItemButton>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary={"Users"} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>

      <Divider />
      <List>
        <ListItem key={"Reviews"} disablePadding>
          <Link to="/admin/dashboard/reviews">
            <ListItemButton>
              <ListItemIcon>
                <RateReviewIcon />
              </ListItemIcon>
              <ListItemText primary={"Reviews"} />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
    <PageTitle title={"Dashboard"} />
    <div className="dashboardContainer">
      {/* fixed portion for toggling features */}
      <div className="drawerSwich">
        {["bottom"].map((anchor) => (
          <React.Fragment key={anchor}>
            <Button className="menu3dot" onClick={toggleDrawer(anchor, true)}>
              {"⋮"}
            </Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>

      <div>
        <h1>Dashboard</h1>
        <Outlet />
      </div>
    </div>
    </>
  );
}
