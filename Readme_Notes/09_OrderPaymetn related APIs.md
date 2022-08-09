## 09_OrderPaymetn related APIs

#### orderSchema, createOrder, payOrder, edit status,delete order etc ....

### orderSchema : [ 04:08:28 - 04:14:30 ]

1. এজন্য প্রথমে 6PP_ECOMMERCE/backend/**models** folder এ order এর জন্য 6PP_ECOMMERCE/backend/models/**orderModel.js** file create করতে হবে যেখানে আমরা **_orderSchema_** বানাব

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/models/orderModel.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: { type: String, required: true, },
        city: { type: String, required: true, },
        state: { type: String, required: true, },
        country: { type: String, required: true, },
        pinCode: { type: Number, required: true, },
        phoneNo: { type: Number, required: true, },
    },
    orderItems: [
        {
            name: { type: String, required: true, },
            price: { type: Number, required: true, },
            quantity: { type: Number, required: true, },
            image: { type: String, required: true, },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    paymentInfo: {
        id: { type: String, required: true, },
        status: { type: String, required: true, },
    },
    paidAt: { type: Date, required: true, },
    itemsPrice: { type: Number, required: true, default: 0, },
    taxPrice: { type: Number, required: true, default: 0, },
    shippingPrice: { type: Number, required: true, default: 0, },
    totalPrice: { type: Number, required: true, default: 0, },
    orderStatus: { type: String, required: true, default: "Processing", },
    deliveredAt: Date,
    createdAt: { type: Date, default: Date.now, },
});

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
```
####








### createOrder  : [ 04:14:30 - 04:20:00 ]

2. এজন্য প্রথমে 6PP_ECOMMERCE/backend/**controllers** folder এ 6PP_ECOMMERCE/backend/controllers/**orderController.js** file create করতে হবে এবং  **_orderModel_** কে import করে নিতে হবে। এরপর **_createNewOrder_** নামের async function create করতে হবে যেখানে frontend থেকে যাবতীয় ordering related info আসবে আর তারপর **_await orderModel.create({})_** method এর সাহায্যে একটা নতুন order create হবে আর শেষে একটা **success messasge** response হিসেবে যাবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/orderController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const orderModel = require("../models/orderModel");


// create a new order
exports.createNewOrder = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await orderModel.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "order is created successfully",
        order,
    });
})
```
####

3. এবার 6PP_ECOMMERCE/backend/**routes** folder এ  6PP_ECOMMERCE/backend/routes/**orderRoute.js** file বানিয়ে তাতে **_createNewOrder_**  function কে import করে এর জন্য একটা **_.post()_** route বানাতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/orderRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { createNewOrder } = require("../controllers/orderController");
const { verifyJWT } = require("../middleware/auth");



const router = express.Router();



router.route("/order/new").post(verifyJWT, createNewOrder);






module.exports = router;
```
####

4. **app.js** file বানিয়ে তাতে **_orderRoute_** কে import করে এর জন্য একটা **_app.use()_** method এর সাহায্যে invoke করতে হবে বানাতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/app.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");


const app = express();


app.use(cors())
app.use(express.json())
app.use(cookieParser());



// Route Imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const errorMiddleware = require("./middleware/error");



// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);


// last placing Middleware for Errors
app.use(errorMiddleware);


module.exports = app;
```
####

5. এবার **postman software** দিয়ে project test করার হবে **_createNewOrder_** কে
####

####
![postman success screenshot](https://i.ibb.co/ryxR1r1/Screenshot-1.png)
####









### getSingleOrderDetails, myAllOrders  : [ 04:20:00 - 04:26:00]

6. এজন্য 6PP_ECOMMERCE/backend/controllers/**orderController.js** file এ **_getSingleOrderDetails,myAllOrders_** নামের async function create করতে হবে যেখানে 
####

>
>> getSingleOrderDetails এর ক্ষেত্রে,
>>>frontend থেকে order এর **id**  পাঠানো হচ্ছে
>>
>>> এখানে **_.findById(req.params.id).populate("user","name email")_** এ 
>>>
>>>> **_.findById()_** method এর সাহায্যে আমরা database থেকে product কে বের করে এনেছি
>>>> **_.populate("user","name email")_** method এর সাহায্যে বলে দিচ্ছি যে, **_findById()_** method এর সাহায্যে যেই order টা পেয়েছি তার মাঝে **_user_** key এর value হিসেবে যেই user এর **id** store করা আছে তার সাপেক্ষে **_user_** collection থেকে সেই user এর **_name & email_** কে note নিয়ে রাখ

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/orderController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const orderModel = require("../models/orderModel");
const ErrorHandler = require("../utils/ErrorHandler");


// create a new order
exports.createNewOrder = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const order = await orderModel.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "order is created successfully",
        order,
    });
})

// get Single Order details
exports.getSingleOrderDetails = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler(`Order not found with this Id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myAllOrders = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});
```
####

7. এজন্য 6PP_ECOMMERCE/backend/routes/**orderRoute.js** file এ **_getSingleOrderDetails & myAllOrders_**  function কে import করে এর জন্য **_.get()_** route বানাতে হবে
####

> এখানে order related সকল route গুলো অবশ্যি logged in user ও কিছু কিছু ক্ষেত্র বিশেষে admin authorised user রা কেবল access পাবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/orderRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const { createNewOrder, getSingleOrderDetails, myAllOrders } = require("../controllers/orderController");
const { verifyJWT } = require("../middleware/auth");



const router = express.Router();



router.route("/order/new").post(verifyJWT, createNewOrder);
router.route("/order/:id").get(verifyJWT, getSingleOrderDetails);
router.route("/orders/me").get(verifyJWT, myAllOrders);






module.exports = router;
```
####

8. এবার **postman software** দিয়ে project test করার হবে **_getSingleOrderDetails_** কে
####

####
![postman success screenshot](https://i.ibb.co/wLwnf33/Screenshot-1.png)
####

9. এবার **postman software** দিয়ে project test করার হবে **_myAllOrders_** কে
####

####
![postman success screenshot](https://i.ibb.co/p2JKH5c/Screenshot-1.png)
####






 
### getAllOrders, deleteOrder : [ 3:15:06 - 3:22:21]
 
> **getAllOrders, deleteOrder** feature enable করার জন্য করনিয় ঃ
 
10. এবার 6PP_ECOMMERCE/backend/controllers/**orderController.js** file এ  **_getAllOrders & deleteOrder_**  নামের async function create করতে হবে যেখানে এ দুটোই **AdminRoute**
 
 
> 
>> এখানে **_getAllOrders_** functin এ
>>> সবগুলো **orders** পাবার পাশাপাশি এর উপর **_.forEach()_** method apply করে **orders** এর **_totalAmmout_** ও জানতে হবে যাতে পরবর্তিতে **payment** related কাজ করা যায়
>
>> আর **_deleteOrder_** functin এ
>>> frontend থেকে **req.params** থেকে order এর **id** পাঠাতে হবে
 
####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/orderController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
 
 const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const orderModel = require("../models/orderModel");
const ErrorHandler = require("../utils/ErrorHandler");


// create a new order
exports.createNewOrder = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "order is created successfully",
    order,
  });
})

// get Single Order details
exports.getSingleOrderDetails = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler(`Order not found with this Id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myAllOrders = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});


/* 
===================================
Admin related APIs
===================================
*/


// get all orders -- AdminRoute
exports.getAllOrders = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const orders = await orderModel.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    message: "All orders are fetched successfully",
    totalAmount,
    orders,
  });
});


// delete Order -- AdminRoute
exports.deleteOrder = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order is deleted successfully",
  });
});
 
```
####
 
11. এবার 6PP_ECOMMERCE/backend/routers/**orderRouter.js** file এ **_getAllOrders & deleteOrder_** এর জন্য যথাক্রমে **_.get() & .delete()_** নামের **AdminRoute** create করতে হবে
 
####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routers/orderRouter.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
 const express = require("express");
const { createNewOrder, getSingleOrderDetails, myAllOrders } = require("../controllers/orderController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");



const router = express.Router();



router.route("/order/new").post(verifyJWT, createNewOrder);
router.route("/order/:id").get(verifyJWT, getSingleOrderDetails);
router.route("/orders/me").get(verifyJWT, myAllOrders);


/* 
===================================
Admin related routes
===================================
*/

router.route("/admin/orders").get(verifyJWT, verifyUserRole("admin"), getAllOrders); // AdminRoute
router.route("/admin/order/:id").delete(verifyJWT, verifyUserRole("admin"), deleteOrder); // AdminRoute






module.exports = router;
```
####
 
12. এবার **postman software** এ গিয়ে test করার হবে **_getAllOrders_** কে
####
![postman success screenshot](https://i.ibb.co/y0vBNnb/Screenshot-2.png)
####
 
13. এবার **postman software** এ গিয়ে test করার হবে **_deleteOrder_** কে
####
![postman success screenshot](https://i.ibb.co/Y7b94hP/Screenshot-2.png)
####
 
 
### updateOrder  : [ 3:15:06 - 3:22:21]
 
> **updateOrder** feature enable করার জন্য করনিয় ঃ
 
14. এবার 6PP_ECOMMERCE/backend/controllers/**orderController.js** file এ **_updateStock_** নামের async fucntion বানাতে হবে যা দুটা parameter নেয় **_id & quantity_** । এবং অন্য আরেকটি  **_updateOrder_** নামের async fucntion বানাতে হবে যেখানে বিভিন্ন ধাপে ধাপে verification করে ** update করবে এবং সেই অনুযায়ী product এর **stock quantity** update করবে **_updateStock_** fucntion কে invoke করার মাধ্যমে
 
>
>> এখানে **_updateStock_** fucntion তার recieve করা **_id_** parameter দিয়ে database থেকে **product** কে খুজে বের করে এনে তার **stock** ammount থেকে **_quantity_** parameter এর ammount বিয়োগ করে stock **save** করে রাখএ
>
>> এখানে **_updateOrder_** fucntion frontend থেকে **req.params & req.body** যথাক্রমে order **id** ও order এর **status** recieve করব
 
####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/orderController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
 const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");


// create a new order
exports.createNewOrder = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await orderModel.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "order is created successfully",
    order,
  });
})

// get Single Order details
exports.getSingleOrderDetails = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler(`Order not found with this Id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myAllOrders = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});


/* 
===================================
Admin related APIs
===================================
*/


// get all orders -- AdminRoute
exports.getAllOrders = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const orders = await orderModel.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    message: "All orders are fetched successfully",
    totalAmount,
    orders,
  });
});


// delete Order -- AdminRoute
exports.deleteOrder = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order is deleted successfully",
  });
});
 
 
 
// update Order, orderStatus, stock status -- AdminRoute
 
async function updateStock(id, quantity) {
  const product = await productModel.findById(id);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
 
 
exports.updateOrder = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
 
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
 
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
 
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (odr) => {
      await updateStock(odr.product, odr.quantity);
    });
  }
  order.orderStatus = req.body.status;
 
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
 
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Order is updated successfully",
  });
});
 
```
####
 
15. এবার 6PP_ECOMMERCE/backend/routers/**orderRouter.js** file এ  **_updateOrder_**  function কে import করে এর জন্য **_.put()_** route বানাতে হবে
 
####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routers/orderRouter.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
 const express = require("express");
const { createNewOrder, getSingleOrderDetails, myAllOrders, getAllOrders, deleteOrder, updateOrder } = require("../controllers/orderController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");



const router = express.Router();



router.route("/order/new").post(verifyJWT, createNewOrder);
router.route("/order/:id").get(verifyJWT, getSingleOrderDetails);
router.route("/orders/me").get(verifyJWT, myAllOrders);


/* 
===================================
Admin related routes
===================================
*/

router.route("/admin/orders").get(verifyJWT, verifyUserRole("admin"), getAllOrders); // AdminRoute
router.route("/admin/order/:id").delete(verifyJWT, verifyUserRole("admin"), deleteOrder).put(verifyJWT,verifyUserRole("admin"),updateOrder); // AdminRoute






module.exports = router;
 
```
####
 
16. এবার **postman software** এ গিয়ে test করার হবে **updateOrder** কে
####
![postman success screenshot](https://i.ibb.co/b33smWz/Screenshot-2.png)
####