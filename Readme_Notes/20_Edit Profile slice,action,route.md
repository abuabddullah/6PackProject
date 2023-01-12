# updating userProfile info name,email,pic

## Update profile info:

### frontend

#### **profileSlice.js** slice file:

> > এখানে reset functin টা **extrareducer** এ দেবার উপায় জানা না থাকায় **reducers** এ দিয়া কাজ চালানো হয়েছে
> >
> > > সামনে আরো অনেক গুলো function **extrareducer & reducers** এ add হবে like, delete user, reset profile remove user etc.

```http
filepath: frontend\src\reducers\productsReducer\profileSlice.js
"""""""""""""""""""""""""""""""""""""""""""
import { createSlice } from "@reduxjs/toolkit";
import { updateUserProfile } from "./profileActions";

const initialState = {
    error: null,
    loading: false,
    isUpdatedUser: false,
    isDeletedUser: false,
    message: null,
  };

  const profileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {
      clearUserProfileErrors: (state, action) => {
        state.error = null;
      },
      updateUserProfileReset: (state, action) => {
        state.isUpdatedUser = false;
      },
    },
    extraReducers: (builder) => {
      /* * for login purpose * */
      // Do something while pending if you want.
      builder.addCase(updateUserProfile.pending, (state, action) => {
        state.loading = true;
        state.isUpdatedUser = false;
      });
      // Do something when passes.
      builder.addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isUpdatedUser = action.payload.success;
        state.message = action.payload.message;
      });
      // Do something if fails.
      builder.addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.isUpdatedUser = false;
        state.error = action.payload;
      });
    },
  });

  export const { clearUserProfileErrors,updateUserProfileReset } = profileSlice.actions;
  export default profileSlice.reducer;

```

#### profileActions.js এ আপাতত updateUserProfile action:

> > put request পাশাপাহি cookie এরর এর জন্য cookie কে frontend থেকে পাঠানো হচ্ছে।
> >
> > > সামনে আরো অনেক গুলো function add হবে like, delete user, reset profile remove user etc.

```http
filepath: frontend\src\reducers\productsReducer\profileActions.js
"""""""""""""""""""""""""""""""""""""
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUserProfile = createAsyncThunk(
  "user/updateUserInfo",
  async (userProfileData, { rejectWithValue }) => {
    try {
      // get token from cookie and send via get request
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
      const token = getCookie("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/v1/me/update",
        userProfileData,
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);


```

#### **_UpdateProfile.js_** route:

> > redux store থেকে **_userProfile,userDetails_** কে নিয়ে নিব
>
> > usestate এর সাহায্যে **_name,email,avatar,avatarPreview_** variable গুলো নিব এদের initial value "" (empty string) দিব **userProfile** থেকে দিব না কারন যদি **userProfile** chaining করে করে দিলে তহন form এ আর data edit করা যায় না
> >
> > > শুধু মাত্র **avatarPreview** এর value দিব **"/Profile.png"** যাতে user কোণ pic select না করলেও এটা default ভাবে set হয়ে যায়
>
> > এবার কাংক্ষিত input field এর মাঝে value হিসেবে এই varibale গুলো আর onchange এ setVar গুলো বসিয়ে দিব
> >
> > > শুধুমাত্র avatar set করার জন্য কিছু steps আছে যা **updateProfileDataChange** fucntion এ লিখা হয়ছে
>
> > এবার **useEffect** এর ভিতরে যদি কিছু conditioning করে setVar-funct,eror-clearing করব আর যদি userProifleUpdate true হয় তাহলে
> >
> > > dispatch(getMyProfile());
> >
> > > navigate("/account");
> >
> > > dispatch(updateUserProfileReset());
> >
> > **বিদ্রঃ** updateUserProfileReset না করলে website crash খায়

### backend

#### updateProfile of userController.js

> > avatar related কিছু new code add করা লাগছে যেখানে বলে দিচ্ছি যদি frontend থেকে কোণ avatar আসে তাহলে user id তা আগের যে ছবি ছিলে তার coloudniary id destroy করে নতুন ছবি কে upload করতে হবে

```http
filepath : backend\controllers\userController.js
""""""""""""""""""""""""""""""""""""""""""
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
  console.log("object");
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await userModel.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

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

  const user = await userModel.findByIdAndUpdate(
    req.params.id,
    roleUpdatingData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

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
});

// delete user (adminRoute)
exports.deleteUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
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
});


```

## Update Password:

- **UpdatePassword.js** file এ থেকে form এর সাহায্যে **oldPassword,newPassword,confirmNewPassword** নিব আর **_dispatch(updateUserPassword(myPasswordForm))_** করব
- **updateUserPassword** action function এ token সহ backend এ উপরোক্ত information গুলো পাঠাব যদিও token পাঠানোর দরকার ছিল না যদি backend থেকেই এটা **req.cookie** এর মাধ্যমে করা যেত
- backend থেকে আমরা **data** হিসেবে **_{success: true,token,user,}_** এগুলো পাব যা **_ProfileSlice.js_** file এ গিয়ে requirement অনুযায়ী redux এ handle করব
  > বিদ্রঃ successfull dispathching শেষে must,
  >
  > > dispatch(getMyProfile());
  >
  > > navigate("/account");
  >
  > > dispatch(updateUserProfileReset());
  >
  > বিশেষ ভাবে **updateUserProfileReset** না করলে error & site crash খাবে

## forgotPassword

1. frontend\src\component\user\ **_ForgotPassword.js_** route এর সাহায্যে user এর **email** টা নিব তারপর **_forgotUserPassword_** action-function কে invoke করব
2. frontend\src\reducers\productsReducer\ **_profileActions.js_** file এ গিয়ে **_forgotUserPassword_** action-function এ post req করব
3. backend\controllers\ **_userController.js_** file এ **req.body** থেকে email recieve করে তার সাহায্যে database থেকে **user** কে **findOne** করে নিয়ে আসব তার পর **getResetPasswordToken** এর সাহায্যে **UserModel** এ নতুন token বানাবো ও তা **this.resetPasswordToken** এর সাহয্যে **hasing** করে database এ save করব
4. এরপর frontend এর hoisting link এর সাথে extra কিছু add করে একটা **_resetPasswordUrl_** বানাব
5. তারপর email এর **message** বানিয়ে **_try-catch_** block এর সাহায্যে **_sendEmail_** function কে invoke করব [যেটা একটা email পাঠানোর function]

## resetPassword

6. এবার
   <a href="https://mail.google.com/">Gmail</a>
   এ গিয়ে দেখব একটা **no-reply** mail এসেছে যেখানে একটা লিংক আছে যেটা সেই উপরের **_resetPasswordUrl_** সেটাতে click করলে আমাদের frontend\src\component\user\ **_ResetPassword.js_** route এ নিয়ে যাবে যেখানে **_password & confirmPassword_** দিতে হবে
7. এবার **userParams** থেকে **token** ও এই **_password & confirmPassword_** এদের সবাইকে একটা object এ wraping করে **_resetUserPassword_** action-function কে invoke করতে হবে
8. frontend\src\reducers\productsReducer\ **_profileActions.js_** file এর **_resetUserPassword_** এ গিয়ে প্রথমে **parameter** থেকে **token** ও **_password & confirmPassword_** কে আলাদা করে ফেলব তারপর put request এর মাঝে **_req.body_** তে paswords গুলোকে পাঠাব আর **_req.params_** এ token কে পাঠাব যা backend\routes\ **_userRoute.js_** file এও **resetPassword** routing এর সময় /password/reset/**_:token_** rout-link এর **token** নামের variable হিসেবেই পাবে
9. এবার backend\controllers\ **_userController.js_** file এ **_resetPassword_** controller-functin এ **_req.params.token_** এর সাহায্যে নতুন front এর token কে **hasing** করে **resetPasswordToken** variable এ রাখবে ও এর সাহয্যে database থেকে user কে **findOne** করব
10. তারপর যদি **req.body** এর **_password & confirmPassword_** same থাকে তাহলে req.body.password কে **user.password** এ সেট করব পাশাপাশি **_user.resetPasswordToken ও resetPasswordExpire_** কে undefined হিসেবে set করে তা সেভ করে দিব এবং সব শেষে **sendToken** function কে invoke করব যা আবার নতুন করে আরেকটা token gnerate করে backend থেকে frontend এ পাঠাবে

> এখানে resetPasswordToken vs token(frontend) vs token(userRoute :token) vs resetPasswordToken(resetPassword func) vs token(sendToken) এর বিশাল একটা confusion আছে
>
> > মুলত **forgetPassword** controller function এ আমরা **getResetPasswordToken** method এর ভিতরে নতুন একটা **token** বানাই ও তা hashing করে user এর database save করি পাশাপাশি এই token টাই email এ করে frtontend এর জন্য পাঠাই
>
> > এরপর frtontend থেকে এই token কেই params এ করে userRoute এ পাঠাই যাকে resetPassword conttroller-function এ **resetPasswordToken** variable এ hashing form এ assinged করা হয় [এটাকে hashing করার কারন হচ্ছে **forgetPassword** এ আমরা এই token কে hasing করেই database এ সেভ করেছিলাম]
>
> > এবার এই hasing হওয়া **resetPasswordToken** এর সাহায্যে databse এ **findOne** করব
>
> > তারপর প্রাপ্ত user এর password change করে দিব user এ ভিতরের সেই হাশিং হয়ে সেভ থাকা **resetPasswordToken** কে undefined করে দিব
>
> এখানে ই **resetPasswordToken** এর কাজ শেষ এরপর যেই **token** আসতেছে তা নতুন আরেকটা **token** যার functionality অনেকটা **register or login** user এর token এর মত
