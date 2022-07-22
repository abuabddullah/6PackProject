const productModel = require("../models/productModel");

// create a product
exports.createProduct = async(req, res,next) => {
    const product = await productModel.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
}

// Get All Product
exports.getAllProducts = (req, res) => {
    res.status(200).json({
        success: true,
        message: "getAllProducts route is working",
    });
};