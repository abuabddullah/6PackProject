const productModel = require("../models/productModel");


// create a product - AdminRoute
exports.createProduct = async(req, res,next) => {
    const product = await productModel.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
}

// update a product - AdminRoute
exports.updateProduct = async(req, res,next) => {
    const id = req.params.id;
    const updateInfo = req.body;
    const product = await productModel.findById(id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        updatedProduct,
    });
}


// delete a product - AdminRoute
exports.deleteProduct = async(req, res,next) => {
    const id = req.params.id;
    const product = await productModel.findById(id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    await product.remove();
    // await productModel.findByIdAndDelete(id); // এটাও চলবে

    res.status(200).json({
        success: true,
        message: "Product deleted",
    });
}



// Get All Product
exports.getAllProducts = async(req, res,next) => {
    const products = await productModel.find();
    res.status(200).json({
        success: true,
        message: "getAllProducts route is working",
        products,
    });
};


// Get Product details by ID
exports.getProductDetails = async(req, res,next) => {
    const id = req.params.id;
    const product = await productModel.findById(id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "getProductDetails route is working",
        product,
    });
}