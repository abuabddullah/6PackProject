const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");


// create a product - AdminRoute
exports.createProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
    req.body.user = req.user.id; // verifyJWT থেকে প্রাপ্ত
    const product = await productModel.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
})

// update a product - AdminRoute
exports.updateProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const updateInfo = req.body;
    const product = await productModel.findById(id);
    if (!product) {
        return next(new ErrorHandler(`Product not found`, 404));
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
})


// delete a product - AdminRoute
exports.deleteProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const product = await productModel.findById(id);
    if (!product) {
        return next(new ErrorHandler(`Product not found`, 404));
    }

    await product.remove();
    // await productModel.findByIdAndDelete(id); // এটাও চলবে

    res.status(200).json({
        success: true,
        message: "Product deleted",
    });
})



// Get All Product
exports.getAllProducts = catchAsyncErrorsMiddleware(async (req, res, next) => {

    const resultPerPage = 2;
    const productsCount = await productModel.countDocuments();

    const apiFeature = new ApiFeatures(productModel.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    let products = await apiFeature.query;

    res.status(200).json({
        success: true,
        message: "getAllProducts route is working",
        products,
    });
});


// Get Product details by ID
exports.getProductDetails = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const product = await productModel.findById(id);
    if (!product) {
        return next(new ErrorHandler(`Product not found`, 404));
    }

    res.status(200).json({
        success: true,
        message: "getProductDetails route is working",
        product,
    });
})


/* 
===================================
product review related APIs
===================================
*/


// create n update product review
exports.createNupdateProductReview = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const ratingInfo = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await productModel.findById(productId);

    const isReviewExist = product.reviews.find(review => review.user.toString() == req.user._id); // review.user is an id (mongoose.Schema.ObjectId)

    console.log(isReviewExist);

    if (isReviewExist) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) 
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(ratingInfo);
        product.numOfReviews = product.reviews.length;
    }

    // find avg review rating
    let sumOftotalReviews = 0;
    product.reviews.forEach(review => {
        sumOftotalReviews += review.rating;
    }),
        avgRating = sumOftotalReviews / product.reviews.length;
    product.ratings = avgRating;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Product review done successfully",
        product,
    });
})


// get all product reviews of a product
exports.getProductAllReviews = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const productId = req.query.id;
    const product = await productModel.findById(productId);

    if (!product) {
        return next(new ErrorHandler(`Product not found`, 404));
    }
const reviews = product.reviews;
    res.status(200).json({
        success: true,
        message: "get All Product Reviews route is working",
        reviews,
    });
})

