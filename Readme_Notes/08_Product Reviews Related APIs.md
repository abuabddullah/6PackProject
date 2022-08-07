## 08_Product Reviews Related APIs

#### createProductReview+updateProductReview etc ....

### createNupdateProductReview : [ 03:47:00 - 4:00:43 ]


> এখানে বেশ কয়েকটা জিনিস কে মাথায় নিয়ে কাজ করতে হবে
>> প্রথমে দেখতে হবে এই user এর পক্ষথেকে আগে কোন review আছে কিনা সেটা জানতে আমাদের **.find** method use করে দেখতে হবে?
>>
>>> **যদি না থাকে তাহলে**, normally তার rivew কে database এর **_product.reviews_** collection এ জমা রাখতে হবে
>>
>>> **যদি আগে থেকেই থাকে তাহলে**, **.forEach** method এর সাহায্যে user এর **_id_** এর সাপেক্ষে সেই আগের rating এর data কে নতুন rating এর data দিয়ে replace করে দিতে হবে
>
>> দ্বিতীয়ত product টির মোট reviews সংখ্যাকে database এর **_product.numOfReviews** collection এ জমা রাখতে হবে
>
>> তৃতীয়ত product টির মোট review এর **avg review** বের করে এনে তাকে database এর **_product.ratings_** collection এ জমা রাখতে হবে


1. এজন্য প্রথমে cross-check করে নিতে হবে যে, **productSchema_** তে **_reviews_** array তে user এর information keep করার মত কোন **_schema_** generate করা আছে কিনা যদি না থাকে তাহলে অবশ্যি আগে user এর জন্য **_schema_** বানাতে হবে যেখানে **_প্রতিটা user যারা review দিচ্ছে বা দিবে তাদের "id" keep করা থাকবে_**
####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/models/productModel.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = mongoose.model("Product", productSchema);
const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
```
####
2. এজন্য 6PP_ECOMMERCE/backend/controllers/**productController.js** file এ **_createNupdateProductReview_**  নামের async function create করতে হবে যেখানে,
####

> এখানে বেশ কয়েকটা জিনিস কে মাথায় নিয়ে কাজ করতে হবে
>
>> user এর **id** এর against এ আগে থেকেই **product** এর  review আছে কিনা check করার সময় আমরা **_.find()_** method এর ভিতর **_review.user.toString()_** method use করেছি কারন **productScema** এর **reviews** array তে **_user_** key এর value হিসেবে user এর **id** থাকে এবং এগুলা থাকে **_mongoose.Schema.ObjectId_** format এ তাই আগে string এ রূপান্তরিত করে নিতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/productController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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



```
####

3. এবার 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **_createNupdateProductReview_**  function কে import করে এর জন্য একটা **_.put()_** route বানাতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createNupdateProductReview,
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




module.exports = router;
```
####

4. এবার **postman software** দিয়ে project test করার হবে **_createNupdateProductReview_** কে
####

####
![postman success screenshot](https://i.ibb.co/hf6PrD6/Screenshot-1.png)
####





### getProductAllReviews & deleteReview : [ 4:00:43 - 04:08:28]

> এবার আমরা কোন specific product এর উপরে ভিন্ন ভিন্ন মানুষের দেয়া সবগুল reviews দেখার features implement করব

5. এজন্য 6PP_ECOMMERCE/backend/controllers/**productController.js** file এ **_getProductAllReviews_**  নামের async function create করতে হবে যেখানে 
####

>
>> frontend এর সাহায্যে product এর **id** query তে recieve করা হবে
>
>> backend এ এই প্রাপ্ত **productId** এর সাপেক্ষে database থেকে **product**-কে বের করে আনা হবে
>
>> সব শেষে এই **product** এর **_reviews_** arr কে **_res_** হিসেবে পাঠিয়ে দেয়া হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/productController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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


```
####

6. এজন্য 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **_getProductAllReviews_**  function কে import করে এর জন্য একটা **_.get()_** rotue বানাতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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
```
####

7. এবার **postman software** দিয়ে project test করার হবে **_getProductAllReviews_** কে
####

####
![postman success screenshot](https://i.ibb.co/6HJW5z5/Screenshot-1.png)
####






### deleteReview  : [ 03:47:00 - 04:08:28]

10. এজন্য 6PP_ECOMMERCE/backend/controllers/**productController.js** file এ **_deleteReview_**  নামের async function create করতে হবে যেখানে
####

>
>> frontend থেকে **_req.query_** তে **_id,productId_** হিসেবে যথাক্রমে **_review এর id_** ও **_product এর id_** আসবে
>
>> এরপর **_productId_** দিয়ে database থেকে product কে বের করে আনতে হবে আর **_reviewId_** দিয়ে **product** এর ভিতরের **reviews** array তে **filtering** করে এই **id** এর review বাদে বাকি সব reviews গুলো কে **_reviews_** নামের variable এ রাখতে হবে
>
>> এরপর **_.forEach()_** method এর সাহায্যে avg ratings, তাছাড়া মোট reviews এর সংখ্যা বের করে **_.findByIdAndUpdate()_** method এর সাহায্যে database এর **_reviews_** array কে পুনরায় update করে দিলেই হয়ে যাবে **_delete a review_**

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/productController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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
    let sumOfAllRating = 0;
    product.reviews.forEach(review => {
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

// delete a Review of user
exports.deleteProductReview = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const reviewId = req.query.id;
    const productId = req.query.productId;

    const product = await productModel.findById(productId);

    if (!product) {
        return next(new ErrorHandler(`Product not found`, 404));
    }

    const reviews = product.reviews.filter(review => review._id.toString() !== reviewId.toString());
    const numOfReviews = reviews.length;

    // updating avg review rating
    let sumOfAllRating = 0;
    reviews.forEach(review => {
        sumOfAllRating += review.rating;
    });

    let ratings = 0;
    if (reviews.length === 0) {
        ratings = 0;
    } else {
        const avgRating = sumOfAllRating / reviews.length;
        ratings = avgRating;
    }

    await productModel.findByIdAndUpdate(productId, {
        reviews,
        numOfReviews,
        ratings,
    },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        

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
})
```
####

11. এজন্য 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **_deleteReview_**  function কে import করে এর জন্য একটা **_.delete()_** route বানাতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createNupdateProductReview, getProductAllReviews, deleteProductReview,
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
router.route("/reviews").get(getProductAllReviews).delete(verifyJWT,deleteProductReview);




module.exports = router;
```
####

12. এবার **postman software** দিয়ে project test করার হবে **_deleteReview_** কে
####

####
![postman success screenshot](https://i.ibb.co/2hy5Jm7/Screenshot-1.png)
####




















































































































































### deleteReview  : [ 03:47:00 - d56f4gd441df32g4dg4 ]

10. এজন্য 6PP_ECOMMERCE/backend/controllers/**productController.js** file এ **_deleteReview_**  নামের async function create করতে হবে যেখানে 6v4654s654s65465f4sd654s6dv4sdf6d
####

> এখানে sd51s41xd65146541s35g

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/productController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
sdf41f65ds4f
```
####

11. এজন্য 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **_deleteReview_**  function কে import করে এর জন্য একটা 65d4fg65df456dfg4456g41fd6
####

> এখানে 465xcf456xdfg4dxf65df56g4ছি

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
654cxvvb41xc56f41d511b145dch
```
####

12. এবার **postman software** দিয়ে project test করার হবে **_deleteReview_** কে
####

####
![postman success screenshot](https://i.ibb.co/6HJW5z5/Screenshot-1.png)
####