## 06_Nodmailer ForgotPassword

#### nodemailer, forgot password, reset password, change password etc ....

### ForgotPassword by help of nodemailer : [ 2:50:25 - 3:15:06]

> **ForgotPassword** feature enable করার জন্য করনিয় ঃ
>
>> ১ | আমাদের প্রথমে **getResetPasswordToken** funciton বানাতে হবে যা forget password এর জন্য request করলে একটা নতুন token generate করে **userSchema** তে add করে দিবে দিবে,
>
>> ৩ | তারপর **sendEmail** funciton বানাতে হবে যা **nodemailer** function এর সাহায্যে user কে link সহ একটা email sent করবে 
>
>> ২ | **sendEmail** funciton কে invoke করার জন্য **userContoller.js** file এ **forgotPassword** নামের asycn function create করতে হবে
>
>> ৪ | এরপর maiing system enable করতে হবে **google mail** এ গিয়ে 
>
>> ৫ | এবার **postman software** দিয়ে **forgot password** এর জন্য post request দিলে দেখা যাবে user এর email এ admin এর email থেকে একটা **reset password link** এর mail sent হয়েছে যদিও এখনো এই **mail link** টা deactivated তাই এরপরে **mail link** টাকে activate করতে হবে

####
1. এবার 6PP_ECOMMERCE/backend/models/userModel.js file এ **crypto**  কে import করে তারপর userSchema এর ভিতরে methods হসেবে **getResetPasswordToken** function কে push করে দিব যা মূলত forget password এর জন্য request করলে একটা নতুন token generate করে **userSchema.resetPasswordToken & userSchema.resetPasswordExpire** এ add করে দিবে দিবে পাশাপাশি এই funciton থেকে **resetToken** কে return করে দিবে।
####

> এখানে **"crypto.randomBytes().toString()"** method এর সাহায্যে একটা নতুন token বানিয়ে তা **resetToken** variable এ assign করে দিতে হবে
> এবার **resetToken** variable এর token টাকে **hashing** করে পাশাপাশি "**crypto.createHash().update().digest()**" method এর সাহায্যে userSchema তে add করতে হবে 
>
>> এখানে **.createHash()** method **resetToken** variable এর token টাকে **hashing** করে
>
>> এখানে **.update()** method **resetToken** variable এর string value কে **hashing** value তে update করে
>
>> এখানে **.digest()** method **resetToken** variable এর string value কে **hexadecimal** value তে update করে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/models/userModel.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// hasing or encrypting password befor saving modification
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
});


// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};


// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(64).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256") // hashing resetToken with "sha256" algorithm
    .update(resetToken) // updating resetToken
    .digest("hex"); // converting resetToken to hexadecimal

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};



const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
```
####

2. এবার **gmail** এর সাথে **nodemailer** কে attached করতে হবে,

####
> 
>>goto : [https://myaccount.google.com/security?hl=en](https://myaccount.google.com/security?hl=en)
> 
>>enable **2 steps verification** if not enabled yet
> 
>>click **App Passwords** just bellow **2-step verification**
> 
>>confirm pass and **set app and device name** and it will give you a **16 digit** password whichi we will have to use in our code.
####

3. এবার **nodmailer & gmail** এর সাথে mailing করার জন্য আমাদের বেশ কিছু **environment** variable বানাতে হবে 6PP_ECOMMERCE/backend/config/**config.env** file এ,

####
>
>>SMPT_HOST, SMPT_PORT & SMPT_SERVICE হুবহু same থাকবে এটা gmail এর নিজস্ব system
>
>>SMPT_MAIL : **owoner** এর mail address যার id থেকে mail যাবে requester বা user দের কাছে
>
>>SMPT_PASSWORD : gmail এর **App Passwords** থেকে পাওয়া **16 digit** password
>>> এখানে account holder এর gmail pass দিলে হবে না বরং **16 digit** এর **App Passwords** দিতে হবে
####


####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/config/config.env]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

PORT=5000
DB_URI="mongodb://localhost:27017/Ecommerce"
JWT_SECRET=902c5afe4dd21930d732a3380b9bd69caa751760c43317cb763df12db49c9120c375946f305f3e8833556c7708766e643a280cfe10f3bfeb1fe10f08dfbb92bb
JWT_EXPIRE=5d
COOKIE_EXPIRE=5

SMPT_HOST=smtp.gmail.com
SMPT_PORT=465
SMPT_SERVICE=gmail
SMPT_MAIL=asifaowadud@gmail.com
SMPT_PASSWORD=zltsrtlbgibmqlnu
```
####

4. এবার **utils** folder এ 6PP_ECOMMERCE/backend/utils/**sendEmail.js** file বানাবো, সেখানে **_nodemailer_** কে import করে নিব, তারপর **_sendEmail_** নামের একটা async function বানাব যেটাই মূলত mail sending এর যতরকম action নেয়া দরকার like, **transporter,mail details** creating এবং সবশেষে **transporter.sendMail()** function এর সাহায্যে mail sent করা
####

> প্রথমত বলতে হয় **_sendEmail_** funtion যা একতা **object type parameter**  recieved করবে অর্থাৎ এইখানে ব্যবহৃত **options** parameter টা মূলত একটা object যে mailing details related information like, **mailSub, reciever email, mail message** must must hold করে থাকবে
> এখানে **transporter** variable মূলত **website holder** এর information carry করে যেখানে কিছু information থাকে যা depend করে কোন ধরনের **maililng tool** use করা হচ্ছে like **gmail** আর হচ্ছে **sender person information**
> এবার **mailDetails** variable বানাতে হয় যাতে **sender email, reciever email, subject, message** define করা থাকে
> সবশেষে **transporter.sendMail(mailDetails)** method এর সাহায্যে sent করা হয়

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/utils/sendEmail.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const mailDetails = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailDetails);
};

module.exports = sendEmail;
```
####

5. এখন 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ প্রথমে **_sendEmail_** function কে import করে নিতে হবে তারপর **forgetPassword** এর জন্য একটা async function বানাতে হবে যেটা frontend থেকে **req.body** তে user এর email recieve করবে তারপর **_getResetPasswordToken_** function কে invoke করার মাধ্যমে **userSchema** থেকে নতুন generated একটা token পাবে তারপর **email body** বানিয়ে **_message_** variable এ assign করানো হুবে এবং সবশেষে **_sendEmail_** function কে invoke করে email sent করা হবে

> **userModel** file  এর **_getResetPasswordToken_** function এ যদিও নতুন token generate হয়ে **userSchema** তে add হয় কিন্তু save হয় না save হয় **userController.js** file এ **_user.save({ validateBeforeSave: false })_** method এর কারনে
> **_forgotPassword_** mail এ যে link পাঠানো হবে তাতে যাতে commonURL **_/api/v1/_** include থাকে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/userController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");

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

```
####

6. এবার **_forgotPasswor_** এর জন্য 6PP_ECOMMERCE/backend/routes/**userRoute.js** file এ **_router.route().post()_** method এর সাহায্যে একতা post API create করতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword } = require("../controllers/userController");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);


module.exports = router;
```
####

7. এবার **postman software** দিয়ে project test করার হবে **forgot password request** কে
####

####
![postman success screenshot](https://i.ibb.co/SVSZKXc/xcv.png)
####

8. এবার **gmail** এ গিয়ে mail sent হয়েছে কিনা test করার হবে **sent email document** কে
####
![postman success screenshot](https://i.ibb.co/P64k0Ft/Screenshot-2.png)
####




### resetPassword by help of nodemailer : [ 3:15:06 - 3:22:21]

> **resetPassword** feature enable করার জন্য করনিয় ঃ

####
9. এবার 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ **crypto**  কে import করে তারপর **forgotPassword** request এর থেকে যে **token** generate হয়েছে তার সাহায্যে user কে **_findOne_** করে তার password কে reset করে দিব
####
>
>> এখানে **_crypto.createHash().update(req.params.token).digest()_** method আমাদের url এর params থেকে token কে recive করে পাশাপাশি take hashin করে **_resetPasswordToken_** varible এ assign করে দেয়
>
>> **_resetPasswordExpire: { $gt: Date.now() }_** এর মানে হচ্ছে যদি userSchema তে save করা **resetPasswordExpire** key এর date expired না হয় তাহলে **_findOne_** method implement করতে হবে
>
>> **_user.password = req.body.password_** এর মানে হচ্ছে user যে নতুন pasword দিল অর্থাৎ **confirmed** password কে user এর final password হিসেবে assign করে **_user.save()_** method এর সাহায্যে save করে দিচ্ছি
>
>> সব শেষে **sendToken(user, 200, res)** method এর সাহায্যে token কে frontend এ পাঠিয়ে দিচ্ছি

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


```
####

10. এবার **gmail** এ গিয়ে **token** কে copy করে **postman software** এ test করব
####
![postman success screenshot](https://i.ibb.co/F0QMMZk/Screenshot-1.png)
####




### re-register,faulty token, expired token errorhandle with custom error message : [ 3:22:21 - 3:25:18]

> বেশ কিছু **error** থাকে যা আমরা চাইলে **custom message create** করে আমাদের মত করে handle করে রাখতে পারি যেমন,
>> কেউ একই **email** দিয়ে যদি আবারো **register** করতে চায় তাহলে একধরনের **_"E11000 duplicate key error collection: Ecommerce.users index: email_1 dup key: { email: \"asif@asif.asif\" }"_** err আসে যা বুঝা কঠিন
>
>> যদি JWT token এ **wronng or expired**  থাকে তাহলে একধরনের err আসে যা বুঝা কঠিন
>
> এই নিচের দেখানো system এ আমরা আমাদের নিজেরদের মত কোন একটা specific err এর জন্য specific কোন error message দেখাতে পারি

####
> re-register default-error
![postman success screenshot](https://i.ibb.co/Vxc6425/xcv.png)
####

####
9. এবার 6PP_ECOMMERCE/backend/middleware/**error.js** file এ re-register,faulty token, expired token এর জন্য আলাদা আলাদা function create করে error গুলো handle করব
####

> এখানে **console.log(err.stack)** কে console করলে দেখতে পারব প্রতিটা **_err_** এর জন্য specific **_code_** or **_name_** আছে যার সাপেক্ষে আমরা **_custom error message_** create করে তাদের push করব

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/middleware/error.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const ErrorHandler = require("../utils/ErrorHandler");

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // console.log(err.stack);
    // Wrong Mongodb Id error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      err = new ErrorHandler(message, 400);
    }

    

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}
module.exports = errorMiddleware;
```
####

10. এবার **postman software** এ test করব
####
> re-register custom-error
![postman success screenshot](https://i.ibb.co/jT0YcTf/Screenshot-1.png)
####