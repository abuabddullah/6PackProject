## 02_Making Product Related APIs

#### APIs : productSchema, productModel, productRoute, GET, POST, UPDATE, DELETE (37:45 - 51:45)


1. backend folder এর ভিতরে "6PP_ECOMMERCE/backend/**models**" folder বানাতে হবে যার ভিতরে "6PP_ECOMMERCE/backend/models/**productModel.js**" file বানাতে হবে। 

>_basically এই model গুলোই মূলত mongodb এর **collection** এর মত কাজ করে_

2. এবার "6PP_ECOMMERCE/backend/models/**productModel.js**" file এ **mongoose** কে import করে **_mongoose.schema()_** method দিয়ে **product** এর schema বা কংকাল বানাতে হবে যেখানে **product** object এর সকল **key-value** এর বৈশিষ্ট define করা থাকবে, এরপর সবার নিচে **collection Name, schema name** সহ **_mongoose.model()_** method এর সাহায্যে **model** টা বানিয়ে **inline exports** করে দিব।

>_মনে রাখতে হবে **collection name** অবশ্যই singular form এ দিতে হবে আর **user** এর **schema** টা আপাতত skip থাকবে_

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/models/productModel.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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

// module.exports = mongoose.model("Product", productSchema);
const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
```
### POST req for creating a product by -- _ADMINROUTE_
####
3. এবার "6PP_ECOMMERCE/backend/controllers/**productController.js**" file এ **productModel** কে import করে নিয়ে তারপর **createProduct** নামের asynchronus function generate করতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const productModel = require("../models/productModel");

// create a product - AdminRoute
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
router.route("/admin/product/new").post(createProduct);







module.exports = router;

```

####
5. এবার **postman software** দিয়ে project test করার জন্য **Ecommerce** collection এ **_http://localhost:5000/api/v1/admin/product/new_** link এর against এ **body** তে **json** format এ একটা **POST request** generate করতে হবে
####

####
![postman success screenshot](https://i.ibb.co/YLQHCp2/xcv.png)

####

####
6. এবার **mongodb_compass software** দিয়ে database check করতে হবে,
####

####
![mongodb_compass success screenshot](https://i.ibb.co/JkCxW8m/xcv.png)
####


### GET req for having all products (51:45 - 1:02:37)
####
7. এবার "6PP_ECOMMERCE/backend/controllers/**productController.js**" file এ **getAllProducts** নামের function কে asynchronus করতে হবে পাশাপাশি এটাকে এমন একটা **GET API** বানাতে হবে যা সব products কে database থেকে get করতে পারে।
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const productModel = require("../models/productModel");

// create a product - AdminRoute
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

### PUT,DELETE req for Updating, Deleting a product respectively by -- _ADMINROUTE_
####
8. এবার "6PP_ECOMMERCE/backend/controllers/**productController.js**" file এ  **updateProduct, deleteProduct** নামের asynchronus function generate করতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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

```

####
9. এবার **updateProduct, deleteProduct** function এর router বানানোর জন্য "6PP_ECOMMERCE/backend/routes/**productRoute.js**" file এ **updateProduct, deleteProduct** function কে import করে **_router.route().put().delete()_** method দিয়ে নতুন **PUT & DELETE API** এর route বানাতে হবে 
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct,
} = require("../controllers/productController");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(createProduct);
router.route("/admin/product/:id").put(updateProduct).delete(deleteProduct);







module.exports = router;

```

####
10. এবার **postman & mongodb_compass software** দিয়ে project test করে দেখতে হবে,
####

####
![postman & mongodb_compass success screenshot](https://i.ibb.co/4N6CnRQ/put.png)
####
![postman & mongodb_compass success screenshot](https://i.ibb.co/Wc3f9rb/dlt.png)
####




### GET req for having details of a specific product
####
11. "6PP_ECOMMERCE/backend/controllers/**productController.js**" file এ  **getProductDetails ** নামের asynchronus function generate করতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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

```

####
12. এবার **getProductDetails** function এর router বানানোর জন্য "6PP_ECOMMERCE/backend/routes/**productRoute.js**" file এ **getProductDetails** function কে import করে **_router.route().get()_** method দিয়ে নতুন **GET API** এর route বানাতে হবে । 

>_এখানে same **path** এর সবগুলো  req কে একই সাথে একই line এ দেয়া যেত কিন্তু **AdminRoute & NonAdminRoute** differenciate করারা জন্য আলাদা আলাদা দুটা line এ করা হয়েছে_

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails,
} = require("../controllers/productController");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(createProduct); // AdminRoute

// router.route("/admin/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails); // allowed
router.route("/admin/product/:id").put(updateProduct).delete(deleteProduct) // AdminRoute
router.route("/product/:id").get(getProductDetails);







module.exports = router;

```

####
13. এবার **postman & mongodb_compass software** দিয়ে project test করে দেখতে হবে,
####

####
![postman & mongodb_compass success screenshot](https://i.ibb.co/7nkBpgY/xcv.png)
####


