## 02_Making Product Related APIs

#### APIs : productSchema, productModel, productRoute, GET, POST, UPDATE, DELETE (37:45 - 51:45)


1. backend folder এর ভিতরে "6PP_ECOMMERCE/backend/**models**" folder বানাতে হবে যার ভিতরে "6PP_ECOMMERCE/backend/models/**productModel.js**" file বানাতে হবে। basically এই model গুলোই মূলত mongodb এর **collection** এর মত কাজ করে
2. এবার "6PP_ECOMMERCE/backend/models/**productModel.js**" file এ **mongoose** কে import করে **_mongoose.schema()_** method দিয়ে **product** এর schema বা কংকাল বানাতে হবে যেখানে **product** object এর সকল **key-value** এর বৈশিষ্ট define করা থাকবে, এরপর সবার নিচে **collection Name, schema name** সহ **_mongoose.model()_** method এর সাহায্যে **model** টা বানিয়ে **inline exports** করে দিব। মনে রাখতে হবে **collection name** অবশ্যই singular form এ দিতে হবে আর **user** এর **schema** টা আপাতত skip থাকবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/models/productModel.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
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
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
    /*user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },*/
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

/* user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },*/
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
```

####
3. এবার "6PP_ECOMMERCE/backend/controllers/**productController.js**" file এ **productModel** কে import করে নিয়ে তারপর **createProduct** নামের asynchronus function generate করতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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

```

####
4. এবার **createProduct** function এর router বানানোর জন্য "6PP_ECOMMERCE/backend/routes/**productRoute.js**" file এ **createProduct** function কে import করে **_router.route().post()_** method দিয়ে আরেকটা নতুন **POST API** এর route বানাতে হবে 
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const {
  getAllProducts, createProduct,
} = require("../controllers/productController");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/product/new").post(createProduct);







module.exports = router;

```

####
5. এবার **postman software** দিয়ে project test করার জন্য **Ecommerce** collection এ **_http://localhost:5000/api/v1/product/new_** link এর against এ **body** তে **json** format এ একটা **POST request** generate করতে হবে
####

####
![postman success screenshot](https://i.ibb.co/YLQHCp2/xcv.png)

####

####
6. এবার **mongodb_compass software** দিয়ে database check করতে হবে
####

####
![mongodb_compass success screenshot](https://i.ibb.co/JkCxW8m/xcv.png)
####

####
7. এবার "6PP_ECOMMERCE/backend/controllers/**productController.js**" file এ **getAllProducts ** নামের function কে asynchronus করতে হবে পাশাপাশি এটাকে এমন একটা **GET API** বানাতে হবে যা সব products কে database থেকে get করতে পারে।
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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
exports.getAllProducts = async(req, res,next) => {
    const products = await productModel.find();
    res.status(200).json({
        success: true,
        message: "getAllProducts route is working",
        products,
    });
};

```
####
![postman success screenshot](https://i.ibb.co/GPm1LM0/xcv.png)
####
