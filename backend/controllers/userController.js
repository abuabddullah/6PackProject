const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const sendEmail = require("../sendEmail");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");


/* 
===================================
User Authentication related APIs
===================================
*/


// Register a User
exports.registerUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: "myCloud.public_id",
      url: "myCloud.secure_url",
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
