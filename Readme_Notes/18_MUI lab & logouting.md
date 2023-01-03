# Implementing Logout functionality using mui-lab

## installation

> open **frontend** terminal and install **_@material-ui/lab_**

```http
    npm i @material-ui/lab
```

## logOutMe()

১.মূলত system টা হচ্ছে লগাউটের জন্যে frontend থেকে just এই **/logout** route এ hit করব আর automatically **cookie থেকে token remove হবে** এবং state এর **userInfo:null** হবে কিন্তু cookie-issues এর কারনে আমাদের forcely frontend থেকেই cookie remove করেতে হচ্ছে

> > **token** remove এর system হচ্ছে expired date old করে দেয়া
>
> > and এখানে যখন **/logout** route এ hit করব তখন কোন কিছু return করলেও তা recived করা হয়নি চাইলে করা যাবে data কে return

```http
filepath: frontend\src\reducers\productsReducer\userActions.js
""""""""""""""""""""""""""""""""

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userInfo, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/login",
        userInfo,
        config
      );

      // saving token in coockie for 5 days
      document.cookie = `token=${data.token}; expires=${new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      )}; path=/`;

      return data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const registerNewUser = createAsyncThunk(
  "user/registerNewUser",
  async (userData, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/register",
        userData,
        config
      );

      // saving token in coockie for 5 days
      document.cookie = `token=${data.token}; expires=${new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000
      )}; path=/`;

      return data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getMyProfile = createAsyncThunk("user/getMyProfile", async () => {
  try {
    // get token from cookie and send via get request
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const token = getCookie("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    const { data } = await axios.get("http://localhost:5000/api/v1/me", config);

    return data.user;
  } catch (err) {
    return err.response.data.message;
  }
});

export const logoutMe = createAsyncThunk("user/logoutMe", async () => {
  try {
    // remove token from cookie
    const removingCookieByName = "token";
    document.cookie = removingCookieByName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    await axios.get("http://localhost:5000/api/v1/logout");
  } catch (err) {
    return err.response.data.message;
  }
});


```

2. slice বানানো
   > > logoutMe এর জন্য কোন **addCase.pending** এর দরকার পরে না

```http
filepath: frontend\src\reducers\productsReducer\userSlice.js
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

import { createSlice } from "@reduxjs/toolkit";
import {
  getMyProfile,
  loginUser,
  logoutMe,
  registerNewUser,
} from "./userActions";

const initialState = {
  userInfo: {},
  error: null,
  loading: false,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    clearUserErrors: (state, action) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* * for login purpose * */
    // Do something while pending if you want.
    builder.addCase(loginUser.pending, (state, action) => {
      state.loading = true;
      state.isAuthenticated = false;
    });
    // Do something when passes.
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    });
    // Do something if fails.
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    });

    /* * for registerUser purpose * */
    // Do something while pending if you want.
    builder.addCase(registerNewUser.pending, (state, action) => {
      state.loading = true;
      state.isAuthenticated = false;
    });
    // Do something when passes.
    builder.addCase(registerNewUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    });
    // Do something if fails.
    builder.addCase(registerNewUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    });

    /* * for getMyProfile purpose * */
    // Do something while pending if you want.
    builder.addCase(getMyProfile.pending, (state, action) => {
      state.loading = true;
      state.isAuthenticated = false;
    });
    // Do something when passes.
    builder.addCase(getMyProfile.fulfilled, (state, action) => {
      if (typeof action.payload === "string") {
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        return;
      } else {
        state.loading = false;
        state.isAuthenticated = true;
        state.userInfo = action.payload;
      }
    });
    // Do something if fails.
    builder.addCase(getMyProfile.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    });

    /* * for logoutMe purpose * */
    // for logout purpose we don't need to do anything while pending.
    // Do something when passes.
    builder.addCase(logoutMe.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
    });
    // Do something if fails.
    builder.addCase(logoutMe.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = action.payload;
    });
  },
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;



```

## functionality implementation

1. App.js এ state থেকে _userInfo & isAuthenticated_ কে destructured করে নিব
2. **isAuthenticated** এর সাপেক্ষে **_UserOption_** component define করব যার ভিতরে **useInfo** কে পাঠিয়ে দিব

```http
filepath: frontend\src\App.js
""""""""""""""""""""""""""""""""
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import "./App.css";
import Home from "./component/Home/Home.js";
import Footer from "./component/layout/Footer/Footer.js";
import Header from "./component/layout/Header/Header.js";
import UserOption from "./component/layout/Header/UserOption.js";
import NotFound from "./component/layout/NotFound/NotFound.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import SingleProductDetails from "./component/Product/SingleProductDetails";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginSignUp from "./component/user/LoginSignUp";
import store from "./app/store";
import { getMyProfile } from "./reducers/productsReducer/userActions";
import { useSelector } from "react-redux";

function App() {
  const { userInfo, isAuthenticated } = useSelector(
    (state) => state.userDetails
  );

  //loading font from webfontloader
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(getMyProfile());
  }, []);

  return (
    <div className="App56fg1h">
      <Header />
      {isAuthenticated && <UserOption userInfo={userInfo} />}


      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyWord" element={<Products />} />

        <Route path="/product/:_id" element={<SingleProductDetails />} />

        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        {/* <Route path="/account" element={</Account />} /> */}

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;

/*
const parentObj = {
    name: "parent",
    child: {
        name: "immidateChild",
        age: 30,
        child: {
            name: "grandChild",
            age: 10,
        }},
      };

      const { name, child: { name: childName, age: childAge, child: { name: grandChildName, age: grandChildAge } } } = parentObj; */


```

3. এবার **UserOption** component এ **_mui-lab_** এর ৩টি component define করব নিচের মত করে
   > > SpeedDial component এর ক্ষেত্রে fixed কিছু attriute দিতে হবে,
   > >
   > > > **onOpen, onClose,open** মূলত hover effect controll করে
   > >
   > > > **direction,icon** যথাক্রমে drop-down-direction ও profile pic define করে
   > > >
   > > > > এখানে profile pic **userInfo** থেকে নেয়া হয়েছে নতুবা **publlic/Profile.png**
   > >
   > > > **style,className** এ zIndex ও সিএসএস class দেয়া হয়েছে যার ফলে hover effect ঠিকমত কাজ করে ও layer টা **ReactOverLayNavber** এর just নিচে যায়
   >
   > > এখন নিয়ম হচ্ছে যতগুলো dropdown দরকার ততগুলো **SpeedAction** component লাগবে তাই উপরে array বানিয়ে এর ভিতরে mapping করেছি
   > >
   > > > **SpeedAction** component এ,
   > > >
   > > > > **icon,tooltipTitle** যথাক্রমে dropdown element এর name & icon define করে
   > > >
   > > > > **tooltipOpen** এর সাহায্যে একটা condtition দিয়েছি আর তা হলে যদি স্ক্রিন সাইজ ৬০০ এর কম থাকে তাহলে logoতে ক্লিক করলে **icon** এর পাশে auto **tooltipTitle** দেখাবে যা বড় screen এ দেখাবে না
   > > >
   > > > > **onClick** এ একটা ফাংশন declare করে দিয়েছি যাতে icon গুলোতে click করেলে যেন কাংখিত route এ navigate করে
   > > > > **logOutUser** এর **ExitIcon** এ click করলে user logged out হবে state এ **userInfo:null** হবে এবং **isAuthenticated:false** হবে

```http
filepath: frontend\src\component\layout\Header\UserOption.js
""""""""""""""""""""""""""""""""
import { Backdrop, SpeedDial, SpeedDialAction } from "@mui/material";
import React, { Fragment, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logoutMe } from "../../../reducers/productsReducer/userActions";

const UserOption = ({ userInfo }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
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


```
