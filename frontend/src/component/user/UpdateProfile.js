import FaceIcon from "@mui/icons-material/Face";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../reducers/productsReducer/profileActions";
import {
  clearUserProfileErrors,
  updateUserProfileReset,
} from "../../reducers/productsReducer/profileSlice";
import { getMyProfile } from "../../reducers/productsReducer/userActions";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get user from redux store
  const { userInfo } = useSelector((state) => state.userDetails);

  // get user profile from redux store
  const { error, loading, isUpdatedUser } = useSelector(
    (state) => state.userProfile
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    const myProfileForm = new FormData();

    myProfileForm.set("name", name);
    myProfileForm.set("email", email);
    myProfileForm.set("avatar", avatar);
    dispatch(updateUserProfile(myProfileForm));
  };

  // set avatar on change
  const updateProfileDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (userInfo) {
      setName(userInfo?.name);
      setEmail(userInfo?.email);
      setAvatarPreview(userInfo?.avatar?.url);
    }

    if (error) {
      toast.error(error, { id: "Profile error" });
      dispatch(clearUserProfileErrors());
    }

    if (isUpdatedUser) {
      toast.success("Profile Updated Successfully", {
        id: "updateUserProfile",
      });
      // get updated user profile
      dispatch(getMyProfile());
      // navigate to account route
      navigate("/account");

      dispatch(updateUserProfileReset());
    }
  }, [dispatch, error, isUpdatedUser, navigate, userInfo]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <PageTitle title={"Update Profile"} />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                encType="multipart/form-data" // to upload image
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
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

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Update"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
