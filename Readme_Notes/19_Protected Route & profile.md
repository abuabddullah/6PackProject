# Protected Routing

> > যদি **userInfo** থাকে তাহলে তাকে কাংক্ষিত route এ যেতে দিব নইলে **LoginSignUp** route এ পাঠিয়ে দিব

## create RequireAuth.js

```http
filePath : frontend\src\component\protectedRoutes\RequireAuth.js
"""""""""""""""""""""""""""""""""""""""""""""

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "./../layout/Loader/Loader";

const RequireAuth = ({ children }) => {
  const { userInfo, isAuthenticated, error, loading } = useSelector(
    (state) => state.userDetails
  );
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;



```

## Wrapping Childre component with RequireAuth in App.js

```http
filePath : frontend\src\component\user\MyAccount.js
"""""""""""""""""""""""""""""""""""""""""""""

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
import MyAccount from "./component/user/MyAccount.js";
import RequireAuth from "./component/protectedRoutes/RequireAuth.js";
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
        <Route
          path="/account"
          element={
            <RequireAuth>
              <MyAccount />
            </RequireAuth>
          }
        />

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

## create MyAccount.js

```http
filePath : frontend\src\component\user\MyAccount.js
"""""""""""""""""""""""""""""""""""""""""""""

import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";

const MyAccount = () => {
  const { userInfo, isAuthenticated, error, loading } = useSelector(
    (state) => state.userDetails
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
        <PageTitle title={`${userInfo.name}'s Profile`} />
          <div className="profileContainer">
            <div>
              <h1>My Profile</h1>
              <img src={userInfo.avatar.url} alt={userInfo.name} />
              <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{userInfo.name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{userInfo.email}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{String(userInfo.createdAt).substr(0, 10)}</p>
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default MyAccount;



```
