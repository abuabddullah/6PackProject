import MailOutlineIcon from "@mui/icons-material/MailOutline";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotUserPassword } from "../../reducers/productsReducer/profileActions";
import { clearUserProfileErrors } from "../../reducers/productsReducer/profileSlice";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  // get user profile from redux store
  const {
    error,
    loading,
    isUpdatedUser,
    isResetPassword,
    isDeletedUser,
    message,
  } = useSelector((state) => state.userProfile);

  // setVar
  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    /* const myForgetPasswordForm = new FormData();

    myForgetPasswordForm.set("email", email); */

    const myForgetPasswordForm = { email };
    dispatch(forgotUserPassword(myForgetPasswordForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "forgotUserPassword error" });
      dispatch(clearUserProfileErrors());
    }

    if (message) {
      setEmail("");
      toast.success("Mail Sent Successfully", {
        id: "forgotUserPassword",
      });
    }
  }, [dispatch, error, message]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <PageTitle title={"Forgot Password"} />
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>

              <form
                className="forgotPasswordForm"
                onSubmit={forgotPasswordSubmit}
              >
                <div className="forgotPasswordEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {message && (
                  <a href="https://mail.google.com/mail/" target="_blank">
                    Check Mail ?
                  </a>
                )}
                <input
                  type="submit"
                  value="Send"
                  className="forgotPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
