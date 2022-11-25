import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../PageTitle/PageTitle";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return (
    <>
      <PageTitle title="Not Found" />
      <div className="not-found">
        <h2>404!</h2>
        <p>Page Not Found</p>
      </div>
    </>
  );
};

export default NotFound;
