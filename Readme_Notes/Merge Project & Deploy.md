# File Condition Befor Merging

### File Path: backend\app.js

```http

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



```

### File Path: backend\controllers\userController.js

```http

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




```

### File Path: backend\server.js

```http

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

### File Path: .gitignore

```http

# backend_ignore_files
/node_modules
/frontend/node_modules
# /backend/config/config.env



```

### File Path: .frontend\.gitignore

```http

# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
# /build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*




```

### File Path: frontend\package.json

```http

{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@material-ui/data-grid": "^4.0.0-alpha.37",
    "@material-ui/lab": "^4.0.0-alpha.61",
    "@mui/icons-material": "^5.8.4",
    "@mui/lab": "^5.0.0-alpha.123",
    "@mui/material": "^5.10.1",
    "@reduxjs/toolkit": "^1.8.4",
    "@stripe/react-stripe-js": "^1.16.3",
    "@stripe/stripe-js": "^1.46.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.27.2",
    "chart.js": "^4.2.1",
    "country-state-city": "^3.1.2",
    "overlay-navbar": "^1.2.3",
    "react": "^18.2.0",
    "react-alert": "^7.0.3",
    "react-alert-template-basic": "^1.0.2",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-helmet": "^6.1.0",
    "react-icons": "^4.4.0",
    "react-js-pagination": "^3.0.3",
    "react-material-ui-carousel": "^3.4.2",
    "react-rating-stars-component": "^2.2.0",
    "react-redux": "^8.0.2",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.1",
    "react-toastify": "^9.0.8",
    "redux": "^4.2.0",
    "redux-devtools-extension": "^2.13.9",
    "redux-thunk": "^2.4.1",
    "web-vitals": "^2.1.4",
    "webfontloader": "^1.6.28"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "http://192.168.0.104:5000"
}




```

# steps to Merge

> > **_frontend_** folder এ **_npm run build_** command terminal এ
>
> > frontend এর building শেষ হলে **_npm run dev_** & **_npm start_** দিয়ে যথাক্রমে frontend ও backend চালু করব
>
> > now backend\ **_app.js_** file open করে সেখানে কিছু code লিখতে হবে
> >
> > > প্রথমে path কে import করতে হবে
> > >
> > > > const path = require("path");
> >
> > > তারপর নিচের দু লাইন code লিখতে হবে যাই মূলত Merging complete করবে
> > >
> > > > app.use(express.static(path.join(\_\_dirname, "../frontend/build")));
> > >
> > > > app.get("\*", (req, res) => {res.sendFile(path.resolve(\_\_dirname, "../frontend/build/index.html"));});
>
> > এখন আমি frontend এর terminal kill করে দিতে পারব ও তাইই করব ও পাশাপাশি backend এর terminal restart করব এবং browser এ গিয়ে _http://localhost:3000/_ এর বদলে **_https://sixpackproject.onrender.com/_** এ যাব এবং তবুও কাজ করবে কারন **_frontend & backend are merged already_**
> >
> > > **resetPassword** features এর জন্য আমরা backend\controllers\ **userController.js** file থেকে email এ একটা লিংক পাঠাতাম যেখানে আমাদের **_FRONTEND_URL_** env var use করতে হত। এখন আমাদের আর **FRONTEND_URL** use করতে হবে না যেহেতু frontend marged হয়ে গেছে তাই সেখানে কিছু code চেঞ্জ করতে হবে
> > >
> > > > **applicable code :** const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
> > >
> > > > **rejected code :** const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
> > > > sd4f65sd4f65s4
>
> > এখন frontend folder এর build folder টাকে delete করে দিতে হবে কারন প্রজেক্টটা যখন আমরা cloud এ hosting করব তখন সেখানেও automatically **_npm run build_** command চালু হয়ে নতুন করে frontend\ **build** folder তৈরী হবে
>
> > heroku তে deploy করার জন্য আমাকে **6PP_ECOMMERCE** এর **package.json** file এর scripts এ একটা line add করতে হবে ও root এর ভিতরে **Procfile** ফাইল বানিয়ে তার ভিতরে একটা code লিখে দিতে হবে
> >
> > > package.json এ
> > >
> > > > "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false && npm install --prefix frontend && npm run build --prefix frontend"
> >
> > > 6PP_ECOMMERCE/**Procfile** এ
> > >
> > > > web: node backend/server.js
> >
> > **বিঃদ্রঃ** এগুলো deploy server ভেদে আলাদা আলাদা হবে [render এর জন্য আলাদা]
>
> > এবার backend\ **server.js** file এ গিয়ে কিছু code change করতে হবে
> >
> > > _dotenv.config({ path: "backend/config/config.env" });_ এর পরিবর্তে
> >
> > > **if (process.env.NODE_ENV !== "PRODUCTION") {dotenv.config({ path: "backend/config/config.env" });}** দিতে হবে
> >
> > কারন আমরা যখন backend এর code hosting করব তখন সেখানে কোন **config.env** file থাকবে না বরং আমরা সকন env var গুলোকে manually hosting server এ লিখে দিব এবং পাশাপাশি extra **_NODE_ENV = PRODUCTION_** দিয়ে দিব। কেবল মাত্র তখনই config.env file use করবে যখন project টা আমরা locally আমাদের machine এ run করব। আর local machine এ config.env file এ _NODE_ENV = PRODUCTION_ থাকবে না
>
> > root folder এর .gitignore কে change করতে হবে
>
> > ensure করতে হবে **frontend** folder এ কোন **gitrepo** না থাকে
>
> > root folder কে এখন **github** এ deploy করে render এ hosting করতে হবে
>
> > most importantly frontend এর
> >
> > > সকল **_https://sixpackproject.onrender.com_** লিংক্স কে **_https://sixpackproject.onrender.com/_** convert করা হয়েছে
>
> > এবার root folder এর **_package.json_** file এ সবার last এর proxy এর value change করে
> >
> > > _"proxy": "http://192.168.0.104:5000"_ এর বদলে
> >
> > > **"proxy": "https://sixpackproject.onrender.com/_** দিতে হবে
>
> > এর পর **frontend** folder টা terminal এ open করে **_npm run build_** command দিয়ে frontend/**build** তৈরি করতে হবে
>
> > এবার frontend\ **_.gitignore_** ও root folder এর **_.gitignore_** file এ কিছু change করব
> >
> > > খেয়াল রাখতে হবে যাতে কোন রকম **_build_** folder যাতে ignore না হয়ে যায় কারন **_render.com_** এ **_heroku.com_** এর মত auto build folder create হয় না।
>
> > এবার root folder এর জন্য github repo বানাব
>
> > এবার এই repo টা _**render.com**_ এ host করব ও সকল env vars গুলো সেখানে লিখে দিব just extra হিসেবে **_NODE_ENV = PRODUCTION_** লিখে দিব যেটা local machine এ লিখা থাকবে না

# File Condition after Merging

### File Path: backend\app.js

```http

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const path = require("path");
const errorMiddleware = require("./middleware/error");

const app = express();

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

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

// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);

/* =================
Frontend and Backend Merging code
==================== */
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

// last placing Middleware for Errors
app.use(errorMiddleware);

module.exports = app;




```

### File Path: backend\controllers\userController.js

```http


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

  /* =================
Frontend and Backend Merging code
==================== */
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  /* const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`; */

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



```

### File Path: backend\server.js

```http

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



  /* =================
Frontend and Backend Merging code
==================== */
// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "backend/config/config.env" });
}

/* dotenv.config({ path: "backend/config/config.env" }); */



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

### File Path: gitignore

```http


# dependencies
/node_modules
/frontend/node_modules
/frontend/.pnp
/frontend/.pnp.js

# testing
/frontend/coverage

# production
# /frontend/build

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

### File Path: frontend\.gitignore

```http


# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
# /build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*




```

### File Path: frontend\package.json

```http


{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@material-ui/data-grid": "^4.0.0-alpha.37",
    "@material-ui/lab": "^4.0.0-alpha.61",
    "@mui/icons-material": "^5.8.4",
    "@mui/lab": "^5.0.0-alpha.123",
    "@mui/material": "^5.10.1",
    "@reduxjs/toolkit": "^1.8.4",
    "@stripe/react-stripe-js": "^1.16.3",
    "@stripe/stripe-js": "^1.46.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.3.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.27.2",
    "chart.js": "^4.2.1",
    "country-state-city": "^3.1.2",
    "overlay-navbar": "^1.2.3",
    "react": "^18.2.0",
    "react-alert": "^7.0.3",
    "react-alert-template-basic": "^1.0.2",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-helmet": "^6.1.0",
    "react-icons": "^4.4.0",
    "react-js-pagination": "^3.0.3",
    "react-material-ui-carousel": "^3.4.2",
    "react-rating-stars-component": "^2.2.0",
    "react-redux": "^8.0.2",
    "react-router-dom": "^6.3.0",
    "react-scripts": "5.0.1",
    "react-toastify": "^9.0.8",
    "redux": "^4.2.0",
    "redux-devtools-extension": "^2.13.9",
    "redux-thunk": "^2.4.1",
    "web-vitals": "^2.1.4",
    "webfontloader": "^1.6.28"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "proxy": "https://sixpackproject.onrender.com"
}



```
