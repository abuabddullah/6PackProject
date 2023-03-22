// const ApiFeatures = require("../utils/apiFeatures");
// const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
// const productModel = require("../models/productModel");
// const ErrorHandler = require("../utils/ErrorHandler");

// // create a product - AdminRoute
// exports.createProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     req.body.user = req.user.id; // verifyJWT থেকে প্রাপ্ত
//     const product = await productModel.create(req.body);
//     res.status(201).json({
//         success: true,
//         product,
//     });
// })

// // update a product - AdminRoute
// exports.updateProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const id = req.params.id;
//     const updateInfo = req.body;
//     const product = await productModel.findById(id);
//     if (!product) {
//         return next(new ErrorHandler(`Product not found`, 404));
//     }
//     const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//     });
//     res.status(200).json({
//         success: true,
//         updatedProduct,
//     });
// })

// // delete a product - AdminRoute
// exports.deleteProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const id = req.params.id;
//     const product = await productModel.findById(id);
//     if (!product) {
//         return next(new ErrorHandler(`Product not found`, 404));
//     }

//     await product.remove();
//     // await productModel.findByIdAndDelete(id); // এটাও চলবে

//     res.status(200).json({
//         success: true,
//         message: "Product deleted",
//     });
// })

// // Get All Product
// exports.getAllProducts = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const limit = req.query.limit;
//     const productsCount = await productModel.countDocuments();

//     const apiFeature = new ApiFeatures(productModel.find(), req.query)
//         .search()
//         .filter()
//         .pagination(limit);
//     let products = await apiFeature.query;

//     res.status(200).json({
//         success: true,
//         message: "getAllProducts route is working",
//         productsCount,
//         products,
//     });
// });

// // Get Product details by ID
// exports.getProductDetails = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const id = req.params.id;
//     const product = await productModel.findById(id);
//     if (!product) {
//         return next(new ErrorHandler(`Product not found`, 404));
//     }

//     res.status(200).json({
//         success: true,
//         message: "getProductDetails route is working",
//         product,
//     });
// })

// /*
// ===================================
// product review related APIs
// ===================================
// */

// // create n update product review
// exports.createNupdateProductReview = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const { productId, rating, comment } = req.body;

//     const ratingInfo = {
//         user: req.user._id,
//         name: req.user.name,
//         rating: Number(rating),
//         comment,
//     };

//     const product = await productModel.findById(productId);

//     const isReviewExist = product.reviews.find(review => review.user.toString() == req.user._id); // review.user is an id (mongoose.Schema.ObjectId)

//     console.log(isReviewExist);

//     if (isReviewExist) {
//         product.reviews.forEach((rev) => {
//             if (rev.user.toString() === req.user._id.toString())
//                 (rev.rating = rating), (rev.comment = comment);
//         });
//     } else {
//         product.reviews.push(ratingInfo);
//         product.numOfReviews = product.reviews.length;
//     }

//     // find avg review rating
//     let sumOfAllRating = 0;
//     product.reviews.forEach(review => {
//         sumOfAllRating += review.rating;
//     });
//     const avgRating = sumOfAllRating / product.reviews.length;
//     product.ratings = avgRating;

//     await product.save({ validateBeforeSave: false });

//     res.status(200).json({
//         success: true,
//         message: "Product review done successfully",
//         product,
//     });
// })

// // get all product reviews of a product
// exports.getProductAllReviews = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const productId = req.query.id;
//     const product = await productModel.findById(productId);

//     if (!product) {
//         return next(new ErrorHandler(`Product not found`, 404));
//     }
//     const reviews = product.reviews;
//     res.status(200).json({
//         success: true,
//         message: "get All Product Reviews route is working",
//         reviews,
//     });
// })

// // delete a Review of user
// exports.deleteProductReview = catchAsyncErrorsMiddleware(async (req, res, next) => {
//     const reviewId = req.query.id;
//     const productId = req.query.productId;

//     const product = await productModel.findById(productId);

//     if (!product) {
//         return next(new ErrorHandler(`Product not found`, 404));
//     }

//     const reviews = product.reviews.filter(review => review._id.toString() !== reviewId.toString());
//     const numOfReviews = reviews.length;

//     // updating avg review rating
//     let sumOfAllRating = 0;
//     reviews.forEach(review => {
//         sumOfAllRating += review.rating;
//     });

//     let ratings = 0;
//     if (reviews.length === 0) {
//         ratings = 0;
//     } else {
//         const avgRating = sumOfAllRating / reviews.length;
//         ratings = avgRating;
//     }

//     await productModel.findByIdAndUpdate(productId, {
//         reviews,
//         numOfReviews,
//         ratings,
//     },
//         {
//             new: true,
//             runValidators: true,
//             useFindAndModify: false,
//         });

//     /*
//     // delete a review from product.reviews as alternative
//         product.reviews = reviews;
//         product.numOfReviews = reviews.length;

//         // updating avg review rating
//         let sumOftotalReviews = 0;
//         reviews.forEach(review => {
//             sumOftotalReviews += review.rating;
//         }),
//             avgRating = sumOftotalReviews / reviews.length;
//         product.ratings = avgRating;

//         await product.save({ validateBeforeSave: false });
//      */

//     res.status(200).json({
//         success: true,
//         message: "Product review deleted successfully",
//         product,
//     });
// })

const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");

// create a product - AdminRoute
exports.createProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "6PP_Ecommerce_Products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id; // verifyJWT থেকে প্রাপ্ত
  const product = await productModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// update a product - AdminRoute
exports.updateProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const id = req.params.id;
  const updateInfo = req.body;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }
  const updatedProduct = await productModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({
    success: true,
    updatedProduct,
  });
});

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
});

// Get All Product
exports.getAllProducts = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const limit = req.query.limit;
  const productsCount = await productModel.countDocuments();

  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter()
    .pagination(limit);
  let products = await apiFeature.query;

  res.status(200).json({
    success: true,
    message: "getAllProducts route is working",
    productsCount,
    products,
  });
});

//get All Admin Products
exports.getAdminProducts = catchAsyncErrorsMiddleware(
  async (req, res, next) => {
    const products = await productModel.find();

    res.status(200).json({
      success: true,
      products,
    });
  }
);

// Get Product details by ID
exports.getProductDetails = catchAsyncErrorsMiddleware(
  async (req, res, next) => {
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
  }
);

/* 
===================================
product review related APIs
===================================
*/

// create n update product review
exports.createNupdateProductReview = catchAsyncErrorsMiddleware(
  async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const ratingInfo = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await productModel.findById(productId);

    const isReviewExist = product.reviews.find(
      (review) => review.user.toString() == req.user._id
    ); // review.user is an id (mongoose.Schema.ObjectId)

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
    let sumOfAllRating = 0;
    product.reviews.forEach((review) => {
      sumOfAllRating += review.rating;
    });
    const avgRating = sumOfAllRating / product.reviews.length;
    product.ratings = avgRating;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Product review done successfully",
      product,
    });
  }
);

// get all product reviews of a product
exports.getProductAllReviews = catchAsyncErrorsMiddleware(
  async (req, res, next) => {
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
  }
);

// delete a Review of user
exports.deleteProductReview = catchAsyncErrorsMiddleware(
  async (req, res, next) => {
    const reviewId = req.query.id;
    const productId = req.query.productId;

    const product = await productModel.findById(productId);

    if (!product) {
      return next(new ErrorHandler(`Product not found`, 404));
    }

    /* উপরের ফাংশনে .toString() এর কাজ হচ্ছে objectId(review._id) কে ব্যাবহারযোগ্য করা */

    const reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId.toString()
    );

    const numOfReviews = reviews.length;
    // updating avg review rating
    let sumOfAllRating = 0;
    reviews.forEach((review) => {
      sumOfAllRating += review.rating;
    });

    let ratings = 0;
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      const avgRating = sumOfAllRating / reviews.length;
      ratings = avgRating;
    }

    await productModel.findByIdAndUpdate(
      productId,
      {
        reviews,
        numOfReviews,
        ratings,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    /* 
    // delete a review from product.reviews as alternative
        product.reviews = reviews;
        product.numOfReviews = reviews.length;
    
        // updating avg review rating
        let sumOftotalReviews = 0;
        reviews.forEach(review => {
            sumOftotalReviews += review.rating;
        }),
            avgRating = sumOftotalReviews / reviews.length;
        product.ratings = avgRating;
    
        await product.save({ validateBeforeSave: false });
     */

    res.status(200).json({
      success: true,
      message: "Product review deleted successfully",
      product,
    });
  }
);
