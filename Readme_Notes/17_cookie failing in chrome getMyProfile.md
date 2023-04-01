# tactical handling of cookie failure in chrome

> > মূলত এখন আমাদের চাও্যা হচ্ছে login or regster এর পরে user এর যে informations & token টা আমরা পাচ্ছি তার সাপেক্ষে user এর existence নিয়ে কিছু করেতে অর্থাৎ condtitinal-routing or something else

## Action Define in frontend

> file path : frontend\src\reducers\productsReducer\userActions.js
>
> > unfortunately আমি cookie কে chrome এ backend থেকে সরাসরি save করতে পারিনি তাই আমি frontend এ থেকে save করেছি **_registerNewUser ও loginUser_** actions এর ভিতরে
>
> > আবার **_getMyProfile_** functione এ কোন cookie frontend থেকে পাঠানোর কথা না থাকলেও পাঠাতে হয়েছে
> >
> > > তাই যখন cookie এর এই ঝামেলাটা solve করতে পারব তখন এইটা change করে দিব

```http
file path : frontend\src\reducers\productsReducer\userActions.js
"""""""""""""""""""""""""""""""""""""""""""""""""
______________
present code:
""""""""""""""

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userInfo, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "https://sixpackproject.onrender.comapi/v1/login",
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
        "https://sixpackproject.onrender.comapi/v1/register",
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

    const { data } = await axios.get("https://sixpackproject.onrender.comapi/v1/me", config);

    return data.user;
  } catch (err) {
    return err.response.data.message;
  }
});



______________
actual code will be like:
""""""""""""""


import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userInfo, { rejectWithValue }) => {
    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "https://sixpackproject.onrender.comapi/v1/login",
        userInfo,
        config
      );

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
        "https://sixpackproject.onrender.comapi/v1/register",
        userData,
        config
      );

      return data.user;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const getMyProfile = createAsyncThunk("user/getMyProfile", async () => {
  try {

    const { data } = await axios.get("https://sixpackproject.onrender.comapi/v1/me");

    return data.user;
  } catch (err) {
    return err.response.data.message;
  }
});



```

## verifyJWT modifing in backend

> file path: backend\middleware\auth.js
>
> > আবার **_verifyJWT_** function এ _**req.cookies**_ থেকে auto token পাবার কথা থাকলেও এই ঝামেলা solve করার জন্য আমরা **_req.headers.authorizaton_** এর সাহায্যে frontend থেকে recieved করেছি
> >
> > > তাই যখন cookie এর এই ঝামেলাটা solve করতে পারব তখন এইটা change করে দিব

```http
file path : backend\middleware\auth.js
"""""""""""""""""""""""""""""""""""""""""""""""""
______________
present code:
""""""""""""""


const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrorsMiddleware = require("./catchAsyncErrorsMiddleware");

// verify log in and token generation
exports.verifyJWT = catchAsyncErrorsMiddleware(async (req, res, next) => {
    // get token from headers sent from frontend
    const token = req.headers.authorization.split(" ")[1];


    // const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // it returns {"id", "iat", "exp"}
    const userInfo = await userModel.findById(decodedData.id);
    req.user = userInfo;
    next();
})

// verfy user role "admin"
exports.verifyUserRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role}, is not allowed to access this resouce `,403));
        }
        next();
    };
};



______________
actual code will be like:
""""""""""""""



const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrorsMiddleware = require("./catchAsyncErrorsMiddleware");

// verify log in and token generation
exports.verifyJWT = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // it returns {"id", "iat", "exp"}
    const userInfo = await userModel.findById(decodedData.id);
    req.user = userInfo;
    next();
})

// verfy user role "admin"
exports.verifyUserRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role}, is not allowed to access this resouce `,403));
        }
        next();
    };
};






```

## slice define in frontend

> slice will be same
>
> > but একটা ঝামেলা দেখতে পাচ্ছি আর তা হচ্ছে যদি আমরা logout function implement করি তখন দেখব cookie-issue এর কারনে reload দেবার পর কিংবা token expier হয়ে গেলে state এর **userInfo** তে একটা string show করে **_"Json Web Token is invalid, Try again"_** আর **_isAuthenticated:true_** হয়ে যায় যার ফলে user state এ না থেকেও তার উপস্থিতিতে যেই যেই conditonal-routing করা হয়েছে সবই দেখা যায় আর তাই আগে থেকেই forcefully action.payload এর **string-check** করে **_userInfo:null & isAuthenticated:false_** করে দেয়া হয়েছে
> >
> > > তবে অবশ্যই যখন cookie-issue solved হবে তখন এটা change হবে

```http
file path: frontend\src\reducers\productsReducer\userSlice.js
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

import { createSlice } from "@reduxjs/toolkit";
import { getMyProfile, loginUser, registerNewUser } from "./userActions";

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
  },
});

export const { clearUserErrors } = userSlice.actions;
export default userSlice.reducer;


```

## getting userInfo in App.js

> > App.js এ যদি আমরা user কে get করে state এ রেখেদেই তাহলে এটা পুরা application এর যেকোণ page থেকে accesible হবে যা আমাদেরকে conditional-routing করেত সাহায্যে করবে
>
> > আমরা আগে দেখেছি **_useDispatch_** এর সাহায়ে dispatching কিন্তু আমরা এবার জানলাম যে **_store_** এর মধ্যেও inbuilt একটা **_dispatch_** method থাকে

```http
file path: frontend\src\App.js
""""""""""""""""""""""""""""""""

import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import "./App.css";
import Home from "./component/Home/Home.js";
import Footer from "./component/layout/Footer/Footer.js";
import Header from "./component/layout/Header/Header.js";
import NotFound from "./component/layout/NotFound/NotFound.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import SingleProductDetails from "./component/Product/SingleProductDetails";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginSignUp from "./component/user/LoginSignUp";
import store from "./app/store";
import { getMyProfile } from "./reducers/productsReducer/userActions";

function App() {
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
