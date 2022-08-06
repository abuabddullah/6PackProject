const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails } = require("../controllers/userController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


/* 
==================
Authenticated Routes
==================
*/


router.route("/me").get(verifyJWT,getUserDetails);




module.exports = router;