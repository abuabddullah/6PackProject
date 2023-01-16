const express = require("express");
const { processPayment, sendStripePublishableApiKey } = require("../controllers/paymentController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");



const router = express.Router();



router.route("/payment/process").post(verifyJWT, processPayment);
router.route("/stripePublishableApiKey").get(verifyJWT, sendStripePublishableApiKey);

module.exports = router;