import FaceIcon from "@mui/icons-material/Face";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loginUser,
  registerNewUser,
} from "../../reducers/productsReducer/userActions";
import { clearUserErrors } from "../../reducers/productsReducer/userSlice";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";

const LoginSignUp = () => {
  const navigate = useNavigate();

  // for reducer related to login and register
  const dispatch = useDispatch();
  const { userInfo, error, loading, isAuthenticated } = useSelector(
    (state) => state.userDetails
  );

  // for login form
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // for register form
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // conditional routing for payment based on user login or not
  const location = useLocation();
  const redirectingURL = location.search
    ? location.search.split("=")[1]
    : "/account";
  // api post handler
  useEffect(() => {
    if (error) {
      toast.error(error, { id: "loginUser_error" });
      dispatch(clearUserErrors());
    }
    if (isAuthenticated) {
      navigate(redirectingURL);
    }
  }, [dispatch, error, navigate, isAuthenticated, redirectingURL]);

  // for login form
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: loginEmail, password: loginPassword }));
  };

  // for register form
  const registerSubmit = (e) => {
    e.preventDefault();
    const registerForm = new FormData();

    registerForm.set("name", name);
    registerForm.set("email", email);
    registerForm.set("password", password);
    registerForm.set("avatar", avatar);
    dispatch(registerNewUser(registerForm));
  };

  /** for uploading image preview
   * step 1: create a reader
   * step 2: create a function to read the file during "onload"
   * step 3: if file-loading done set the reader to read the file (like for preview)
   *      onload has 3 readyState:= 0: not started / initial, 1: loading, 2: done
   * step 4: set the reader to read the file as a data url
   */
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
        <PageTitle title={"LoginSignUp"} />
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginSignUp;
