## 06_Nodmailer ForgotPassword

#### nodemailer, forgot password, reset password, change password etc ....

### ForgotPassword by help of nodemailer : [ 2:50:25 - 54fsd4g65df4g65dg46sd5g465g4df56g4 ]

> **ForgotPassword** feature enable করার জন্য করনিয় ঃ
>
>> ১ | আমাদের প্রথমে **getResetPasswordToken** funciton বানাতে হবে যা forget password এর জন্য request করলে একটা নতুন token generate করে **userSchema** তে add করে দিবে দিবে,
>
>> ৩ | তারপর **sendEmail** funciton বানাতে হবে যা **nodemailer** function এর সাহায্যে user কে link সহ একটা email sent করবে 
>
>> ২ | **sendEmail** funciton কে invoke করার জন্য **userContoller.js** file এ **forgotPassword** নামের asycn function create করতে হবে

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

37. এবার **postman software** দিয়ে project test করার হবে **54fsd4g65df4g65dg46sd5g465g4df56g4** কে
####

####
![postman success screenshot](https://i.ibb.co/1MMTrPk/xcv.png)
####

