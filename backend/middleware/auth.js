// const jwt = require("jsonwebtoken");
// const userModel = require("../models/userModel");
// const ErrorHandler = require("../utils/ErrorHandler");
// const catchAsyncErrorsMiddleware = require("./catchAsyncErrorsMiddleware");

// // verify log in and token generation
// exports.verifyJWT = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const { token } = req.cookies;
//     if (!token) {
//         return next(new ErrorHandler("Please Login to access this resource", 401));
//     }
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET); // it returns {"id", "iat", "exp"}
//     const userInfo = await userModel.findById(decodedData.id);
//     req.user = userInfo;
//     next();
// })

// // verfy user role "admin"
// exports.verifyUserRole = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(new ErrorHandler(`Role: ${req.user.role}, is not allowed to access this resouce `,403));
//         }
//         next();
//     };
// };



/* =========================
         fixing cookie not saving issue
============================*/


const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrorsMiddleware = require("./catchAsyncErrorsMiddleware");

// verify log in and token generation
exports.verifyJWT = catchAsyncErrorsMiddleware(async (req, res, next) => {
    // get token from headers sent from frontend
    const token = req.headers.authorization.split(" ")[1];


    // const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // it returns {"id", "iat", "exp"}
    const userInfo = await userModel.findById(decodedData.id);
    req.user = userInfo;
    next();
})

// verfy user role "admin"
exports.verifyUserRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role}, is not allowed to access this resouce `,403));
        }
        next();
    };
};





