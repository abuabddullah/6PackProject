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