const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
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