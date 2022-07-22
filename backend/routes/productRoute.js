const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails,
} = require("../controllers/productController");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/product/new").post(createProduct); // AdminRoute

// router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails); // allowed
router.route("/product/:id").put(updateProduct).delete(deleteProduct) // AdminRoute
router.route("/product/:id").get(getProductDetails);







module.exports = router;