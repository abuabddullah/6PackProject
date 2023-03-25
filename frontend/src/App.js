import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import "./App.css";
import Cart from "./component/Cart/Cart.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import Payment from "./component/Cart/Payment.js";
import Shipping from "./component/Cart/Shipping.js";
import Home from "./component/Home/Home.js";
import Footer from "./component/layout/Footer/Footer.js";
import Header from "./component/layout/Header/Header.js";
import UserOption from "./component/layout/Header/UserOption.js";
import NotFound from "./component/layout/NotFound/NotFound.js";
import MyOrders from "./component/order/MyOrders.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import SingleProductDetails from "./component/Product/SingleProductDetails";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./app/store";
import Dashboard from "./component/admin/Dashboard.js";
import DashboardIndex from "./component/admin/DashboardIndex";
import ManageAllProducts from "./component/admin/ManageAllProducts";
import ManageAllOrders from "./component/admin/ManageAllOrders.js";
import ManageAllUsers from "./component/admin/ManageAllUsers.js";
import ManageAllReviews from "./component/admin/ManageAllReviews.js";
import CreateProduct from "./component/admin/CreateProduct.js";
import OrderDetails from "./component/order/OrderDetails.js";
import RequireAdmin from "./component/protectedRoutes/RequireAdmin.js";
import RequireAuth from "./component/protectedRoutes/RequireAuth.js";
import ForgotPassword from "./component/user/ForgotPassword.js";
import LoginSignUp from "./component/user/LoginSignUp";
import MyAccount from "./component/user/MyAccount.js";
import ResetPassword from "./component/user/ResetPassword.js";
import UpdatePassword from "./component/user/UpdatePassword.js";
import UpdateProfile from "./component/user/UpdateProfile.js";
import { getStripePublishableApiKey } from "./reducers/productsReducer/paymentActions";
import { getMyProfile } from "./reducers/productsReducer/userActions";
import UpdateProduct from "./component/admin/UpdateProduct";
import ProcessOrder from "./component/admin/ProcessOrder";

function App() {
  const { userInfo, isAuthenticated } = useSelector(
    (state) => state.userDetails
  );

  // payment related state
  const { stripePublishableApiKey } = useSelector((state) => state.payment);

  //loading font from webfontloader
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(getMyProfile());
    store.dispatch(getStripePublishableApiKey());
  }, []);

  return (
    <div className="App56fg1h">
      <Header />
      {isAuthenticated && <UserOption userInfo={userInfo} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyWord" element={<Products />} />{" "}
        {/* here :keyWord using for search route */}
        <Route path="/product/:_id" element={<SingleProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <MyAccount />
            </RequireAuth>
          }
        />
        <Route
          path="/me/update"
          element={
            <RequireAuth>
              <UpdateProfile />
            </RequireAuth>
          }
        />
        <Route
          path="/password/update"
          element={
            <RequireAuth>
              <UpdatePassword />
            </RequireAuth>
          }
        />
        <Route
          path="/shipping"
          element={
            <RequireAuth>
              <Shipping />
            </RequireAuth>
          }
        />
        <Route
          path="/order/confirm"
          element={
            <RequireAuth>
              <ConfirmOrder />
            </RequireAuth>
          }
        />
        {stripePublishableApiKey && (
          <Route
            path="/process/payment"
            element={
              <RequireAuth>
                <Elements stripe={loadStripe(stripePublishableApiKey)}>
                  <Payment />
                </Elements>
              </RequireAuth>
            }
          />
        )}
        <Route
          path="/success"
          element={
            <RequireAuth>
              <OrderSuccess />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <MyOrders />
            </RequireAuth>
          }
        />
        <Route
          path="/order/:_id"
          element={
            <RequireAuth>
              <OrderDetails />
            </RequireAuth>
          }
        />
        {/* admin dashboasr related routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdmin>
              <Dashboard />
            </RequireAdmin>
          }
        >
          <Route index element={<DashboardIndex />} />
          <Route path='products' element={<RequireAdmin><ManageAllProducts /></RequireAdmin>} />
          <Route path='product' element={<RequireAdmin><CreateProduct /></RequireAdmin>} />
          <Route path='product/:id' element={<RequireAdmin><UpdateProduct /></RequireAdmin>} />
          <Route path='orders' element={<RequireAdmin><ManageAllOrders /></RequireAdmin>} />
          <Route path='order/:id' element={<RequireAdmin><ProcessOrder /></RequireAdmin>} />
          <Route path='users' element={<RequireAdmin><ManageAllUsers /></RequireAdmin>} />
          <Route path='reviews' element={<RequireAdmin><ManageAllReviews /></RequireAdmin>} />
        </Route>
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
