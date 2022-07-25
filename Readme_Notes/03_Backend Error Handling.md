## 03_Backend errorhandlling with node.js in built _Error_ method

#### Handle Errors for : Wrong Mongodb Id, Mongoose duplicate key error, Wrong JWT, JWT EXPIRE error, http status code erooro

####
1. এবার backend folder এর ভিতরে "6PP_ECOMMERCE/backend/**utils**" folder বানিয়ে তার ভিতরে একটা file বানাতে হবে "6PP_ECOMMERCE/backend/utils/**errorhander.js**" নামের
2. এবার এখানে আমরা একটা js class generate করব **ErrorHandler** নামের যা inherited হবে node.js এর  default **_Error_ Class** feature থেকে  , এরপর সবার নিচ থেকে **_ErrorHandler_** class টাকে export করে দিবা যাতে অন্যসব file থেকে এর সাহায্যে আমরা প্রয়োজনিয় error generate করতে পারি।

> **ErrorHandler** class টাতে, **constructor** এর সাহায্যে আমরা error কে  invoke করার  সময়  যে **agrument** হিসেবে **message** & **statusCode** পাঠাব তা recieve করব।
> **super** এর সাহায্যে আমরা  **super or parent class অর্থাত "Error"** Class এর   message show করার যে default function আছে  তাকে **inherrit** করেছি
> **Error.captureStackTrace** এর সাহায্যে আমরা  **"Error"**  Class এর  যে default **captureStackTrace**  function আছে  তাকে **inherrit** করেছি এই  **captureStackTrace** function ই মুলত কোন error আসলে তা আমাদের **stack** এ trace করে দেয়  দুটা parameter এর সাহায্যে যার একটি হচ্ছে, **(১) child class নিজেই এক্ষেত্রে "ErrorHandler"** এবং ২য় হচ্ছে, **(২) child class এর constructor**

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/utils/errorhander.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this,this.constructor);

    }
    
}

module.exports = ErrorHandler

```

####
3. এবার এই  erro কে  conditionally implement করার জন্য আমাদের একটা  **middleware** বানাতে হবে এজন্য, backend folder এর ভিতরে "6PP_ECOMMERCE/backend/**middleware**" folder বানিয়ে তার ভিতরে একটা file বানাতে হবে "6PP_ECOMMERCE/backend/middleware/**error.js**" নামের
4. এই "6PP_ECOMMERCE/backend/middleware/**error.js**" file এ  **_ErrorHandler_** কে import  করি নিব , তারপর   **module.exports** করব একটা **callback** function কে যা চারটি **parameter** নিবে **_err,req,res,next_**

> এটা মূলত **express.js** এর default error handling method , extra হিসেবে just কিছু **condition** implement করা হয়েছে

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/middleware/error.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorMiddleware 
```


####
5. এবার "6PP_ECOMMERCE/backend/**app.js**" file এ  এই   **_errorMiddleware_** কে import করে নিব, তারপর  **_app.use()_** method এর সাহায্যে সর্ব শেষ middleware হিসেবে **_errorMiddleware_** কে রাখব 

> এটাই মূলত  নিয়ম যে, **errorMiddleware** সবার last এ invoke করা থাকে যাতে অন্যকোন একটা middleware এ কোন সমস্যা হলে programm jump করা এই last middleware এ hit করবে তারপর error show করবে 

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/app.js]]
"""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const cors = require('cors')


const app = express();

const errorMiddleware = require("./middleware/error");


app.use(cors())
app.use(express.json())



// Route Imports
const productRoute = require("./routes/productRoute");



// invoking
app.use("/api/v1", productRoute);


// Middleware for Errors
app.use(errorMiddleware);


module.exports = app;

```

####
6. এবার "6PP_ECOMMERCE/backend/controllers/**productController.js**" file এ **ErrorHander** কে import করে নিয়ে তারপর **getProductDetails **  নামের asynchronus function এর যেখানে আমরা **if condition** use করে error handle করেছিলাম এখন সেখানে **_ErrorHandler_** class use করব

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const productModel = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");


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
    return next(new ErrorHander("Product not found", 404));
  }
  
    res.status(200).json({
        success: true,
        message: "getProductDetails route is working",
        product,
    });
}

```
