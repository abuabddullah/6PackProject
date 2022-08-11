## 07_User Profile Related APIs

#### userDetails, update user Profile, delete user, update user role etc ....

### getUserDetails : [ 3:25:18 - 03:29:00 ]

1. এজন্য 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ **_getUserDetails_**  নামের async function create করতে হবে যেখানে **_id_** এর সাহায্যে user এর infromation database থেকে বের করে তা frontend এ পাঠানো হবে
####

> এখানে **_id_**টা **_req.user_** থেকে নেয়া হয়েছে কারন যেহেতু এই features টা loged in user দের জন্য আর আমরা জানি **_verifyJWT_** function এ আমরা **_userInfo_** কে **_req_** এর ভিতরে push করে দিয়েছি

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/userController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
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
```
####

2. এজন্য 6PP_ECOMMERCE/backend/routes/**userRoute.js** file এ **_getUserDetails_**  function কে import করে এর জন্য একটা **_.get_** route বানাতে হবে
####

> এখানে **_id_**টা **_req.user_** থেকে নেয়া হয়েছে কারন যেহেতু এই features টা loged in user দের জন্য আর আমরা জানি **_verifyJWT_** function এ আমরা **_userInfo_** কে **_req_** এর ভিতরে push করে দিয়েছি

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails } = require("../controllers/userController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


/* 
==================
Authenticated Routes
==================
*/


router.route("/me").get(verifyJWT,getUserDetails);




module.exports = router;
```
####

3. এবার **postman software** দিয়ে project test করার হবে **_getUserDetails_** কে
####

####
![postman success screenshot](https://i.ibb.co/TRQ0C6H/Screenshot-1.png)
####


### update password : [ 03:29:00 - 03:33:30]

4. এজন্য 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ **_updatePasssword_**  নামের async function create করতে হবে যেখানে password টা change করা হবে
####

> এখানে frontend থেকে *_req.body_* তে ৩টা জিনিস পাঠানো হয় *_oldPassword & newPassword,confirmPassword_*
> যেহেতু এই features টা loged in user দের জন্য আর আমরা জানি **_verifyJWT_** function এ আমরা **_userInfo_** কে **_req_** এর ভিতরে push করে দিয়েছি তাই সেই *_id_*  এর সাপেক্ষে database থেকে user কে বের করে নিয়ে কিছু **error handling** করে সব শেষে password টা change করে দিব
>
>> user কে find করার সময় **_.select("+password")_** method কে include করে-করা হয়েছে কারন password সহ user এর info দরকার। আর যেহেতু **_userSchema_** তে passoword এ **_select:false_** দেয়া আছে তাই এই method use না করলে password পাওয়া যেত না

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/userController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
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
```
####

5. এজন্য 6PP_ECOMMERCE/backend/routes/**userRoute.js** file এ **_updatePasssword_**  function কে import করে এর জন্য একটা **_verifyJWT_** সহ **_.put_** req এর route বানাতে  হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword } = require("../controllers/userController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


/* 
==================
Authenticated Routes
==================
*/


router.route("/me").get(verifyJWT, getUserDetails);
router.route("/password/update").put(verifyJWT, updatePassword);




module.exports = router;
```
####

6. এবার **postman software** দিয়ে project test করার হবে **updatePassword** কে
####

####
![postman success screenshot](https://i.ibb.co/P69khF1/Screenshot-1.png)
####


### update profile : [ 03:33:30 - 03:37:15]

7. এজন্য 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ **_updateProfile_**  নামের async function create করতে হবে যেখানে user এর profile like, name or both name and email কে change করতে পারবে
####

>
>> এখানে frontend থেকে *_req.body_* তে 3টা জিনিস পাঠানো হয় *_name & email,avtar_*
>>> **_avtar_** এর কাজ আপাতত করব না কারন এটা করার জন্য **_frontend_** এও কিছু **_cloudinary_** এর কাজ করতে হবে
>
>> যেহেতু এই features টা loged in user দের জন্য আর আমরা জানি **_verifyJWT_** function এ আমরা **_userInfo_** কে **_req_** এর ভিতরে push করে দিয়েছি তাই সেই *_id_*  এর সাপেক্ষে database থেকে user কে বের করে সাথে সাথেই **_findByIdAndUpdate()_** method এর সাহায্যে user profile update করে দিব

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/userController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
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

```
####

8. এজন্য 6PP_ECOMMERCE/backend/routes/**userRoute.js** file এ **_updateProfile_**  function কে import করে এর জন্য একটা **_verifyJWT_** সহ **_.put_** req এর route বানাতে  হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile } = require("../controllers/userController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


/* 
==================
Authenticated Routes
==================
*/


router.route("/me").get(verifyJWT, getUserDetails);
router.route("/password/update").put(verifyJWT, updatePassword);
router.route("/me/update").put(verifyJWT, updateProfile);




module.exports = router;
```
####

9. এবার **postman software** দিয়ে project test করার হবে **_updateProfile_** কে
####

####
![postman success screenshot](https://i.ibb.co/WN97rgW/Screenshot-1.png)
####




### getAllUser, getUser Detail [[AdminRoute]] : [ 03:37:52 - 03:42:10]

10. এবার **admin** যাতে all user কে get করতে পারে ও যেকোন একজন specific user কেও get করতে পারে তারজন্য 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ **__getAllUser & getSingleUser_**  নামের async function create করতে হবে 

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/userController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
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
```
####

11. এজন্য 6PP_ECOMMERCE/backend/routes/**userRoute.js** file এ **_getAllUser & getSingleUser_**  function কে import করে এর জন্য একটা login+admin verified **_.get()_** route বানাতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser } = require("../controllers/userController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


/* 
==================
Authenticated Routes
==================
*/


router.route("/me").get(verifyJWT, getUserDetails);
router.route("/password/update").put(verifyJWT, updatePassword);
router.route("/me/update").put(verifyJWT, updateProfile);


/* 
===================================
User profile related Admin APIs
===================================
*/


router.route("/admin/users").get(verifyJWT, verifyUserRole("admin"), getAllUser); // AdminRoute
router.route("/admin/user/:id").get(verifyJWT, verifyUserRole("admin"), getSingleUser) // AdminRoute



module.exports = router;
```
####

12. এবার **postman software** দিয়ে project test করার হবে **_getAllUser_** কে
####

####
![postman success screenshot](https://i.ibb.co/qx18cVh/Screenshot-1.png)
####

13. এবার **postman software** দিয়ে project test করার হবে **_getSingleUser_** কে
####

####
![postman success screenshot](https://i.ibb.co/qdy6RHt/Screenshot-1.png)
####







### updateUserRole & deleteUser : [ 03:42:10 - 03:47:00]

> অর্থাৎ **admin** চাইলেই যাতে কোন normal user কে **admin-role** দিতে পারে বা কোন user কে ban করে দিতে পারে সেই features add করতে হবে

14. এজন্য 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ **_updateUserRole & deleteUser _**  নামের async function create করতে হবে
####

> এখানে **.delete()** method এ আমরা **avatar** এর জন্য **_cloudinary_** এর কাজ আপাতত স্থগিত রেখেছি যা পরবর্তিতে **frontend** এর সাথে করতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/userController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
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
    message: "user role updated",
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
    message: "user deleted",
  });
})
```
####

15. এজন্য 6PP_ECOMMERCE/backend/routes/**userRoute.js** file এ **_updateUserRole & deleteUser_**  function কে import করে এদের জন্য যথাক্রমে একটা **_.put() & .delete()_** route বানাব
####

> এখানে **path** সবার same বলে একই লাইনেই ভিন্ন ভিন্ন **http request** গুলাকে লিখা হয়েছে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


/* 
==================
Authenticated Routes
==================
*/


router.route("/me").get(verifyJWT, getUserDetails);
router.route("/password/update").put(verifyJWT, updatePassword);
router.route("/me/update").put(verifyJWT, updateProfile);


/* 
===================================
User profile related Admin APIs
===================================
*/


router.route("/admin/users").get(verifyJWT, verifyUserRole("admin"), getAllUser); // AdminRoute
router.route("/admin/user/:id").get(verifyJWT, verifyUserRole("admin"), getSingleUser).put(verifyJWT,verifyUserRole("admin"),updateUserRole).delete(verifyJWT,verifyUserRole("admin"),deleteUser) // AdminRoute




module.exports = router;
```
####

16. এবার **postman software** দিয়ে project test করার হবে **_updateUserRole_** কে
####

####
![postman success screenshot](https://i.ibb.co/0nq95mH/Screenshot-1.png)
####

18. এবার **postman software** দিয়ে project test করার হবে **_deleteUser_** কে
####

####
![postman success screenshot](https://i.ibb.co/B3cPbkD/Screenshot-1.png)
####