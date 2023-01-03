# integrate cloudinary in full stack project:

## installation cloudinary and express-fileupload

> open root folder (/d/LERN MEARN/ **_6PP_ECOMMERCE_**) in terminal and install **_cloudinary,body-parser and express-fileupload_**

```http


npm i express-fileupload
npm i cloudinary

*/  inshort  /*
npm i express-fileupload cloudinary



```

## backend implementation

1. open backend\ _**server.js**_ file and import **cloudinary** and just bellow **_connectDatabase()_** put cloudinary fixed code by creator of cloudinary
   > codes must be same as given here

```http
filepath: backend\server.js
"""""""""""""""""""""""""""""
const app = require("./app");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});
// console.log(testUncaughtError);


//config
dotenv.config({ path: "backend/config/config.env" });



// Connecting to database
connectDatabase();



// connecting to cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// server rendering
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});



// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

```

Now we need to put this 3 **CLOUDINARY_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET** variable from cloudinary website and put those in backend\config\ **_config.env_** file

2. goto the website link <a href="https://cloudinary.com/console/c-45fd4b458112882e6d10d8e5fb2d56">cloudinary dashboard</a> and copy those infromation from the cards

```http
filepath:backend\config\config.env
"""""""""""""""""""""""""""""""""""""

PORT=5000


DB_URI##########################="mongodb+srv://6PP_ECOMMERCE:6PP_ECOMMERCE@cluster0.hj15oxa.mongodb.net/6PP_Ecommerce"
DB_URI##########################="mongodb+srv://6PP_ECOMMERCE:<password>@cluster0.hj15oxa.mongodb.net/6PP_Ecommerce"
DB_URI="mongodb://localhost:27017/Ecommerce"


JWT_SECRET=902c5afe4dd21930d732a3380b9bd69caa751760c43317cb763df12db49c9120c375946f305f3e8833556c7708766e643a280cfe10f3bfeb1fe10f08dfbb92bb
JWT_EXPIRE=5d
COOKIE_EXPIRE=5

SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_SERVICE=gmail
SMPT_MAIL=asifaowadud@gmail.com
SMPT_PASSWORD=zltsrtlbgibmqlnu



CLOUDINARY_NAME=dglsw3gml
CLOUDINARY_API_KEY=393288281474652
CLOUDINARY_API_SECRET=PYDhbIQtyacVMPMkSLhFF8kVY7s



```

3. now goto backend\ **_app.js_** file and import **_bodyParser,fileUpload_**
4. invoke them as per bellow

```http
filepath: backend\app.js
""""""""""""""""""""""""

const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");


const app = express();


app.use(cors())
app.use(express.json())
app.use(cookieParser());

// for integrating cloudinary
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());



// Route Imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const errorMiddleware = require("./middleware/error");



// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);


// last placing Middleware for Errors
app.use(errorMiddleware);


module.exports = app;
```

Now need to modify **_registerUser_** contorller-function in backend\controllers\ **_userController.js_** file by including cloudinary fixed codes

5. import cloudinary in **_userController.js_** file
6. create **_myCloud_**
   > **_myCloud_** recives **_avatar_** param from forntend during dispatching **_registerNewUser_** actions-function
   >
   > > **_myCloud_** needs a folder name which is must created in cloudinary website <a href="https://cloudinary.com/console/c-45fd4b458112882e6d10d8e5fb2d56/media_library/folders/home">media_library</a>
7. now we have to provide this created cloudinary avatar's info during registrating new user in **UserModel**

```http
filepath: backend\controllers\userController.js
""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const cloudinary = require("cloudinary");


/*
===================================
User Authentication related APIs
===================================
*/


// Register a User
exports.registerUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "6PP_Ecommerce_Avtars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  /* const token = user.getJWTToken();
    res.status(201).json({
        success: true,
        message: "user is created",
        token,
        user,
    }); */


  sendToken(user, 201, res);


});

// Login User
exports.loginUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }


  /* const token = user.getJWTToken();
  res.status(200).json({
    success: true,
    message: "user is logged in",
    token,
    user,
  }); */


  sendToken(user, 200, res);
});


// logout user
exports.logoutUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });


  res.status(200).json({
    success: true,
    message: "user is logged out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const email = req.body.email;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `6PP_Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrorsMiddleware(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});


/*
===================================
User profile related APIs
===================================
*/


// Get User Detail
exports.getUserDetails = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});


// update User password
exports.updatePassword = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});


// update User Profile
exports.updateProfile = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "user profile updated",
    user,
  });
});


/*
===================================
User profile related Admin APIs
===================================
*/


// Get all users(adminRoute)
exports.getAllUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (adminRoute)
exports.getSingleUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user role to admin (adminRoute)
exports.updateUserRole = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const roleUpdatingData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await userModel.findByIdAndUpdate(req.params.id, roleUpdatingData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    message: "user role updated successfully",
    user,
  });
})

// delete user (adminRoute)
exports.deleteUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
  }


  /*
  //deleting avatar image
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
 */

  await user.remove();
  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
})
```

## frontend implementation in

> > এখানে ফর্ম এ **_encType="multipart/form-data"_** দেয়া হয়েছে কারন এই form এর সাহায্যে আমরা image upload করব

```http
filepath: frontend\src\component\user\LoginSignUp.js
"""""""""""""""""""""""""""""""""""""""""""""""""""""

import FaceIcon from "@mui/icons-material/Face";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, registerNewUser } from "../../reducers/productsReducer/userActions";
import { clearUserErrors } from "../../reducers/productsReducer/userSlice";
import Loader from "../layout/Loader/Loader";

const LoginSignUp = () => {
const navigate = useNavigate()

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

  // api post handler
  useEffect(() => {
    if (error) {
      toast.error(error, { id: "loginUser_error" });
      dispatch(clearUserErrors());
    }
    if(isAuthenticated){
      navigate("/account")
    }
  }, [dispatch,error,navigate,isAuthenticated]);

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
    console.log(loginEmail, loginPassword);
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


```
