const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

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

    const token = user.getJWTToken();
    
      res.status(201).json({
          success: true,
          message: "user is created",
          token,
          user,
      });
  });