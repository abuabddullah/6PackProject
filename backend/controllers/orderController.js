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
});

// get Single Order details
exports.getSingleOrderDetails = catchAsyncErrorsMiddleware(
  async (req, res, next) => {
    const order = await orderModel
      .findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return next(
        new ErrorHandler(`Order not found with this Id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);

// get logged in user  Orders
exports.myAllOrders = async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
};

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
      await updateStock(odr._id, odr.cartQuantity);
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
