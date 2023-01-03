import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate } from "react-router-dom";
import {
  updateUserPassword,
  updateUserProfile,
} from "../../reducers/productsReducer/profileActions";
import { getMyProfile } from "../../reducers/productsReducer/userActions";
import {
  clearUserProfileErrors,
  updateUserProfileReset,
} from "../../reducers/productsReducer/profileSlice";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get user profile from redux store
  const { error, loading, isUpdatedUser } = useSelector(
    (state) => state.userProfile
  );

  // setVars
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // handle form submit
  const updatePasswordSubmit = (e) => {
    e.preventDefault();
    const myPasswordForm = {};
    myPasswordForm.oldPassword = oldPassword;
    myPasswordForm.newPassword = newPassword;
    myPasswordForm.confirmPassword = confirmPassword;
    dispatch(updateUserPassword(myPasswordForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { id: "UpdatePassword error" });
      dispatch(clearUserProfileErrors());
    }
    if (isUpdatedUser) {
      toast.success("Password Updated Successfully", {
        id: "UpdatePassword success",
      });
      dispatch(getMyProfile());
      navigate("/account");
      dispatch(updateUserProfileReset());
    }
  }, [navigate, isUpdatedUser, dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title={"Change Password"} />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Profile</h2>

              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  value="Change"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdatePassword;
