


### Creating protected route by verifyUserRole function to identify Admin users : [2:41:17 - 645ghb463d4h65gh4]

> ধরেন আপনি কেবল মাত্র যারা logged in এবং admin কেবল তাদের কেই **_updateProduct,deleteProduct_** এর access দিবেন তাহলে কি করতে হবে?
>> আরো একটা **_verifyUserRole_** function বানিয়ে routing করার সময় **_verifyJWT_** এর পরে কিন্তু **_updateProduct,deleteProduct_** এর আগে **_verifyUserRole_** কে বসিয়ে দিতে হবে

####
32. এবার 6PP_ECOMMERCE/backend/middleware/**auth.js** file এ **_verifyUserRole_** নামের একটা async function বানাব যেখানে parameter হিসেবে **_"admin"_** role কে পাব এবার এর ভিতরে check করব parameter এর role কি database এর user এর role কিনা **যদি না থাকে** তাহলে **_error message_** কে res হিসেবে পাঠিয়ে দিব আর **যদি থাকে** তাহলে **_next()_** function কে invoke করব

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/middleware/auth.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrorsMiddleware = require("./catchAsyncErrorsMiddleware");

// verify log in and token generation
exports.verifyJWT = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { token } = req.cookies;
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
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resouce `,403));
        }
        next();
    };
};
```
####

33. এবার test করার জন্য 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **_verifyJWT_** এর পরে কিন্তু **_updateProduct,deleteProduct_** এর আগে **_verifyUserRole_** কে বসিয়ে দিতে হবে
####

> বিস্তারিত বর্ণনা ঃ router.route("/product/new").post(verifyJWT,verifyUserRole,createProduct)
>
>> উপরোক্ত route টি থেকে আমরা আন্দাজ করতে পারি যে যদি কোন একটা নতুন product কে database এ create করতে চাই তাহলে user কে একাধারে logged-In থাকতে হবে ও পাশাপাশি তার role ও admin হতে হবে যা এই দু **verifyJWT,verifyUserRole** functioin দ্বারা identify করা হচ্ছে। 
>
> Wroking Process :
>> প্রথমে user কোন protected route এ ঢুকতে গেলে আগে তার logging-in verification হবে **verifyJWT** function এ এখানে শুরুতে **res.cookies** থেকে token টা নিয়ে সেটাকে **docode** করে user এর **id** কে বের করে আনা হবে তার পর database থেকে এই **id** এর সাপেক্ষে **.findById()** method দিয়ে user এর info কে বের করে নিয়ে **req** এর ভিতরে **user** key তে save করে নেয়া হবে । এরপর **next()** function কে invoke করে route এর immidiate function কে **verifyUserRole** এর কাছে হস্তান্তর করা হবে এটা check করার জন্য যে user কি admin কিনা? এবার সেখান থেকে একটা callback function কে return করতে হবে
>
>> **verifyUserRole** এর ভিতরের callback function এ conditioning করতে হবে যে parameter এর role ও database এর user এর একই কিনা **যদি না থাকে** তাহলে **_error message_** কে res হিসেবে পাঠিয়ে দিব আর **যদি থাকে** তাহলে **_next()_** function কে invoke করব । এবার এই **next()** function কে invoke করে route এর immidiate function কে **createProduct** এর কাছে হস্তান্তর করা হবে

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails,
} = require("../controllers/productController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/product/new").post(verifyJWT,verifyUserRole("admin"),createProduct); // AdminRoute

// router.route("/product/:id").put(verifyJWT,verifyUserRole("admin"),updateProduct).delete(verifyJWT,verifyUserRole("admin"),deleteProduct).get(getProductDetails); // allowed
router.route("/product/:id").put(verifyJWT,verifyUserRole("admin"),updateProduct).delete(verifyJWT,verifyUserRole("admin"),deleteProduct) // AdminRoute
router.route("/product/:id").get(getProductDetails);






module.exports = router;
```
####

34. এবার **postman software** দিয়ে project test করার হবে **verifyUserRole** কে
####

####
![postman success screenshot](https://i.ibb.co/q54WFMy/xcv.png)
####

