import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
              <img src={userInfo?.avatar?.url || "/Profile.png"} alt={userInfo.name} />
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
