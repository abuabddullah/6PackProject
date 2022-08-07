const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails,
} = require("../controllers/productController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(verifyJWT,verifyUserRole("admin"),createProduct); // AdminRoute

// router.route("/product/:id").put(verifyJWT,verifyUserRole("admin"),updateProduct).delete(verifyJWT,verifyUserRole("admin"),deleteProduct).get(getProductDetails); // allowed
router.route("/admin/product/:id").put(verifyJWT,verifyUserRole("admin"),updateProduct).delete(verifyJWT,verifyUserRole("admin"),deleteProduct) // AdminRoute
router.route("/product/:id").get(getProductDetails);






module.exports = router;