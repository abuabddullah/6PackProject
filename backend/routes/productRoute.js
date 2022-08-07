const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createNupdateProductReview, getProductAllReviews,
} = require("../controllers/productController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);



/* 
===================================
AdminRoute related APIs
===================================
*/


router.route("/admin/product/new").post(verifyJWT,verifyUserRole("admin"),createProduct); // AdminRoute

// router.route("/product/:id").put(verifyJWT,verifyUserRole("admin"),updateProduct).delete(verifyJWT,verifyUserRole("admin"),deleteProduct).get(getProductDetails); // allowed
router.route("/admin/product/:id").put(verifyJWT,verifyUserRole("admin"),updateProduct).delete(verifyJWT,verifyUserRole("admin"),deleteProduct) // AdminRoute



/* 
===================================
product review related APIs
===================================
*/



router.route("/review").put(verifyJWT, createNupdateProductReview);
router.route("/reviews").get(getProductAllReviews);




module.exports = router;