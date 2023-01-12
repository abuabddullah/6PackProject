import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate, useParams } from "react-router-dom";
import { resetUserPassword } from "../../reducers/productsReducer/profileActions";
import { toast } from "react-toastify";
import { clearUserProfileErrors } from "../../reducers/productsReducer/profileSlice";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get user profile from redux store
  const {
    error,
    loading,
    isUpdatedUser,
    isResetPassword,
    isDeletedUser,
    message,
  } = useSelector((state) => state.userProfile);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = (e) => {
    e.preventDefault();
    const myPasswordForm = {};
    myPasswordForm.token = token;
    myPasswordForm.password = password;
    myPasswordForm.confirmPassword = confirmPassword;
    dispatch(resetUserPassword(myPasswordForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "resetUserPassword error" });
      dispatch(clearUserProfileErrors());
    }

    if (isResetPassword) {
      toast.success("Password reset done. Please re-login", {
        id: "resetUserPassword",
      });
      navigate("/login");
    }
  }, [dispatch, error, isResetPassword, navigate]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <PageTitle title={"Reset Password"} />
          <div className="resetPasswordContainer">
            <div className="resetPasswordBox">
              <h2 className="resetPasswordHeading">Update Profile</h2>

              <form
                className="resetPasswordForm"
                onSubmit={resetPasswordSubmit}
              >
                <div>
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="resetPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;
