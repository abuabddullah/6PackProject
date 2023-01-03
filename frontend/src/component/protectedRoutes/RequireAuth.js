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
