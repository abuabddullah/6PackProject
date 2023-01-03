import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutMe } from "../../reducers/productsReducer/userActions";
import Loading from "./../layout/Loader/Loader";

const RequireAdmin = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated, error, loading } = useSelector(
    (state) => state.userDetails
  );
  let location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!userInfo || userInfo.role !== "admin") {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.

    // 1. remove token from cookie
    const removingCookieByName = "token";
    document.cookie =
      removingCookieByName + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // 2. logout account
    dispatch(logoutMe());

    // 3. redirect to home page
    navigate("/home");
  }

  return children;
};

export default RequireAdmin;
