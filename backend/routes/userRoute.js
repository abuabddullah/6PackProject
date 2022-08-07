const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
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


router.route("/me").get(verifyJWT, getUserDetails);
router.route("/password/update").put(verifyJWT, updatePassword);
router.route("/me/update").put(verifyJWT, updateProfile);


/* 
===================================
User profile related Admin APIs
===================================
*/


router.route("/admin/users").get(verifyJWT, verifyUserRole("admin"), getAllUser); // AdminRoute
router.route("/admin/user/:id").get(verifyJWT, verifyUserRole("admin"), getSingleUser).put(verifyJWT,verifyUserRole("admin"),updateUserRole).delete(verifyJWT,verifyUserRole("admin"),deleteUser) // AdminRoute




module.exports = router;