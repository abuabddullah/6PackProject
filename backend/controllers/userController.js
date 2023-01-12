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

  // bellow link is edited dueto the change in frontend url
  /* const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`; */

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  console.log(resetPasswordUrl);

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it. \n\n বিঃদ্রঃ যদি restePasswordUrl কে কোন কারনেও একটুকু change করা লাগে (frontend/backend link changing) এর জন্যে তাহলে message variable এ হালকা কিছু লিখে দরকার পরে আবার কেটে দিতে হবে নইলে অনেক সময় link না গিয়ে ip address যায় email এ`;

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
