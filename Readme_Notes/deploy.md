> > deploy করার সময় আমাদের ৫টা folder এ change আনতে হয়েছে আর ২টা folder add করতে হয়েছে

# previously created and edited

## file path:backend\app.js

```http
previous:
""""""""""
const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");


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
const paymentRoute = require("./routes/paymentRoute");
const errorMiddleware = require("./middleware/error");



// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);


// last placing Middleware for Errors
app.use(errorMiddleware);


module.exports = app;


now:
""""
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path"); // for joining frontend and backend in same url

const app = express();




//config is used because it is not working we merged frontend and backend
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
} // for joining frontend and backend in same url


app.use(cors());
app.use(express.json());
app.use(cookieParser());

// for integrating cloudinary
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const errorMiddleware = require("./middleware/error");

// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

/*  // for joining frontend and backend in same url // */
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// last placing Middleware for Errors
app.use(errorMiddleware);

module.exports = app;


```

## file path:backend\server.js

```http
previous:
""""""""""
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


now:
""""
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


//config is commented out because it is not working we merged frontend and backend
/* dotenv.config({ path: "backend/config/config.env" }); */

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
} // for joining frontend and backend in same url





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

## file path:backend\config\config.env

```http
previous:
""""""""""
PORT=5000




DB_URI="mongodb://localhost:27017/Ecommerce"




JWT_SECRET=902c5afe4dd21930d732a3380b9bd69caa751760c43317cb763df12db49c9120c375946f305f3e8833556c7708766e643a280cfe10f3bfeb1fe10f08dfbb92bb
JWT_EXPIRE=5d
COOKIE_EXPIRE=5





SMPT_HOST=smtp.gmail.com
SMPT_PORT##################################=465
SMPT_PORT=587
SMPT_SERVICE=gmail
SMPT_MAIL=asifaowadud@gmail.com
SMPT_PASSWORD=drtlczpynthdmbxw




CLOUDINARY_NAME=dglsw3gml
CLOUDINARY_API_KEY=393288281474652
CLOUDINARY_API_SECRET=PYDhbIQtyacVMPMkSLhFF8kVY7s




FRONTEND_URL = "http://localhost:3000"




STRIPE_PUBLISHABLE_API_KEY=pk_test_51L0mz8C4IDVrgcznLbqLXXayVFuiBQhNv7ouT1ZJjcOqjQTXzqDrYklOGJ956Ure0V1KHUekdi7Hz4TweBSmQdNb00LFLHFL41

STRIPE_SECRET_KEY=sk_test_51L0mz8C4IDVrgcznjJes3WtKlOiKFEsk4RIPj6neZjAiwDvfEqm6EOUSFqUscErRekE7QevGEKBaLK5UBz0iJe0i00XOCONFhE


now:
""""
PORT=5000




DB_URI#########="mongodb://localhost:27017/Ecommerce"
DB_URI=mongodb+srv://6PackProject:6PackProject@6packproject.xshdrws.mongodb.net/6PP_ECOMMERCE?retryWrites=true&w=majority




JWT_SECRET=902c5afe4dd21930d732a3380b9bd69caa751760c43317cb763df12db49c9120c375946f305f3e8833556c7708766e643a280cfe10f3bfeb1fe10f08dfbb92bb
JWT_EXPIRE=5d
COOKIE_EXPIRE=5





SMPT_HOST=smtp.gmail.com
SMPT_PORT##################################=465
SMPT_PORT=587
SMPT_SERVICE=gmail
SMPT_MAIL=asifaowadud@gmail.com
SMPT_PASSWORD=drtlczpynthdmbxw




CLOUDINARY_NAME=dglsw3gml
CLOUDINARY_API_KEY=393288281474652
CLOUDINARY_API_SECRET=PYDhbIQtyacVMPMkSLhFF8kVY7s




FRONTEND_URL = "http://localhost:3000"




STRIPE_PUBLISHABLE_API_KEY=pk_test_51L0mz8C4IDVrgcznLbqLXXayVFuiBQhNv7ouT1ZJjcOqjQTXzqDrYklOGJ956Ure0V1KHUekdi7Hz4TweBSmQdNb00LFLHFL41

STRIPE_SECRET_KEY=sk_test_51L0mz8C4IDVrgcznjJes3WtKlOiKFEsk4RIPj6neZjAiwDvfEqm6EOUSFqUscErRekE7QevGEKBaLK5UBz0iJe0i00XOCONFhE

```

## file path:backend\controllers\userController.js

```http
previous:
""""""""""
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



now:
""""
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

  // bellow link was edited dueto the change in frontend url [casue frontend and backend were in different url frnd:localhost:3000, bknd:localhost:5000]
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`; // for joining frontend and backend in same url

  // bellow link is comment out during deployment casue "frontend and backend are merged in localhost:5000 in app.js file"
  /* const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  console.log(resetPasswordUrl); */

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


```

## file path:.gitignore

```http
previous:
""""""""""
# backend_ignore_files
/node_modules
/frontend/node_modules
# /backend/config/config.env


now for my special need:
""""
# backend_ignore_files
/node_modules
/frontend/node_modules
# /backend/config/config.env


# # dependencies
# /node_modules
# /frontend/node_modules
# /frontend/.pnp
# /frontend/.pnp.js

# # testing
# /frontend/coverage

# # production
# /frontend/build

# # misc
# /backend/config/config.env
# /frontend/.DS_Store
# /frontend/.env.local
# /frontend/.env.development.local
# /frontend/.env.test.local
# /frontend/.env.production.local

# npm-debug.log*
# yarn-debug.log*
# yarn-error.log*



final require:
""""""""""""""
# # backend_ignore_files
# /node_modules
# /frontend/node_modules
# # /backend/config/config.env


# dependencies
/node_modules
/frontend/node_modules
/frontend/.pnp
/frontend/.pnp.js

# testing
/frontend/coverage

# production
/frontend/build

# misc
/backend/config/config.env
/frontend/.DS_Store
/frontend/.env.local
/frontend/.env.development.local
/frontend/.env.test.local
/frontend/.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*



```

# just for creating no changes

## file path:Readme_Notes\deploy.md

## file path:README.md
