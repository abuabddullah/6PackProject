## 04_Search,filter,pagination features implementing

#### xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

### Implement Search feature : [1:24:22 - 1:34:46]

####
1. এজন্য 6PP_ECOMMERCE/backend/**utils**" folder এর ভিতরে একটা file বানাতে হবে "6PP_ECOMMERCE/backend/utils/**apiFeatures.js**" নামের
2. এবার এখানে আমরা একটা js parent class generate করব **ApiFeatures** নামের  যা দুটা **_constructor_** recieve করবে একটা হল **, **_query funct_** এবং ২য়টা হল **_query keyword_**
3. এরপর **_search()_** function এ **query keyword_** থেকে **keyword** varible বের করে নিয়ে আসব। এবং  যদি ি keyword exist না করে তবে,  একটা empty object **{}** create হবে আর যদি **keyword** exist করে তবে, **_name_** নামের একটা object variable declare করে **_keyword_** দিয়ে **_query function_** এ implement করে তারপর পুরা object **_this_** টাকেই return করে দিব

####
> এখানের **name** varible টা কোন variable ই নয় বরং এটা একটা নির্দেরশনা যেহেতু  আমরা search field এ কোন কিছুর নাম লিখেই search করব তাই সেই **keyword** টাকে আগে **"$regex"** symbol দিয়ে মুরিয়ে নিতে হবে যা তারপর allproducts এর **name** keyword এর সাথে match করার চেষ্টাকরবে আর result বের করে নিয়ে আসবে । যদি চাইতাম **description** এর উপরে search চালাতে তাহলে variable এর নামও description রাখতে হত।
> এখানে **name** variable এ  **$regex , $options** হচ্ছে node এর default method আর **$options** এর value **"i"** মানে হচ্ছে **case insensitive**
> এখানে একটা সুক্ষ্ম জিনিস বুঝার আছে , **constructor** এর সাহায্যে আমরা **query** key এর value হিসেবে **query** function কে recive করছি  **কিন্তু** **search()** function এ গিয়ে আবার  **query** key এর value হিসেবে আমরা **find** method থেকে  পাওয়া **array of object** কে set করছি তাই যখন  return হিসেবে **this**  কে পাঠাচ্ছি সেখানে  এমন একটা object return হচ্ছে যেখানে**query** key এর value  হচ্ছে একতা **array of object** not that previous **query function** 

####
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/utils/apiFeatures.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  
 }

module.exports = ApiFeatures;

```
#### example of function inside js class 
####
![postman success screenshot](https://i.ibb.co/TLLPdd0/Capture.png)
####

####
4. এখন আমরা "6PP_ECOMMERCE/backend/controllers/**productController.js "** file এ  **_ApiFeatures_** কে  import করে নিব, তারপর  এর **_getAllProducts_** function এ  **_apiFeatures_**   variable এ **_ApiFeatures_** কে inbvoke করব যেখানে আমরা একটা **object** পাব তারপর  **products** variable এর value হিসেবে  **_apiFeatures_** এর **query** key এর value কে assign করে দিব

####
> এখানে **name** variable এ  **$regex , $options** হচ্ছে node এর default method আর **$options** এর value **"i"** মানে হচ্ছে **case insensitive**

####
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const ApiFeatures = require("../utils/apifeatures");


// create a product - AdminRoute
exports.createProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
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

  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
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

```

####
5. এবার postman software এ test করব mongDb id last এর digit 9 কে অন্যকিছু দিয়ে replace 
####
![postman success screenshot](https://i.ibb.co/dGGKDzB/Capture.png)
####


### Implement filter feature : [1:34:46 - 1:44:48]
####
> implement **filter** feature based on **category,price,rating** etc.
####
6. এবার 66PP_ECOMMERCE/backend/utils/**apiFeatures.js**" file এ **_filter()_** function বানাতে হবে যেখানে, 

####
> এখানে **filter()** function এ প্রথমে **queryStr** এর একটা copy  **queryCopy** variable বানিয়ে নিতে হবে যাতে main **queryStr** এ কোন change না হয় যেহেতু এটা একটা **object type data**
> এরপর কিছু specific  type of key  যাতে এই **queryStr** এ থাকলেও **filter()** function কাজ না করে  কারন তাদের জন্য আলাদা আলাদা function create করাই আছে বা করা হবে তাই তাদের **removeFields** array তে নিয়ে তার উপর **foreach** method দিয়ে restrict করে দিতে হবে
> এরপর  **price,rating** type এর range based filtering এর কথা মাথায় রেখে  express এর regex (**/\b(কুয়েরি methods)\b/g) এবং **replace** method এর সাহায্য **queryCopy** এর শুরুতে **"$"** symbol লাগাতে হবে  
> এবার **.find()** method এর সাহায্যে কাংক্ষিত result পেয়ে যাবার পর পুরা **this** টাকেই return করে দিতে হবে
>
>> regex implement এর আগে **queryCopy** কে **.json** format এ stringify করে নিতে হবে আবার **.find()** method implement করার আগে আবার json টাকে ***.parse** করে নিতে হবে
>> line-30 এর code টা applicable হত যদি  filering  static value এর উপরে করা হত যেহেতু কিছু কিছু filtering করা হয় range based তাই এই line commeneted out হবে আর নিচের code গুলো তখন usable হবে

####
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/utils/apiFeatures.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);
    
    
    // this.query = this.query.find(queryCopy); // [[line-30]] this line of code is for strict value filtering but considering rangeable filter like filtering for price range or rating range this line will fail soo need ot comment out and work as bellow


    // Filter For Price and Rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  
 }

module.exports = ApiFeatures;

```



####
7. এখন আমরা "6PP_ECOMMERCE/backend/controllers/**productController.js "** file এ  **_search()_** function এর পাশে **_filter_()**  function কেও invoke করব

####
> এখানে **name** variable এ  **$regex , $options** হচ্ছে node এর default method আর **$options** এর value **"i"** মানে হচ্ছে **case insensitive**

####
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const ApiFeatures = require("../utils/apifeatures");


// create a product - AdminRoute
exports.createProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
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

  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .search()
    .filter();
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

```

####
8. এবার postman software এ test করব mongDb id last এর digit 9 কে অন্যকিছু দিয়ে replace 
####
![postman success screenshot](https://i.ibb.co/CMMbW76/Capture.png)
####




### Implement pagination feature : [1:44:48 - 1:52:18]
####
> **pagination** feature implement করব based on **total product count, item to show perpage, total result after feltering or searching** etc.
> এবং পাশাপাশি  total product এর মোট সংখ্যা বের করব যাতে  fontend এ pagination এর জন্য button নিতে পারি
> **no Of Total filtered item based on query** টা বের করে নিলেও ভাল হত হয় ত পরে বের করবে
####
9. এবার 66PP_ECOMMERCE/backend/utils/**apiFeatures.js**" file এ **_pagination()_** function বানাতে হবে যেখানে,  এটা একটা parameter recieve করবে যখন 6PP_ECOMMERCE/backend/controllers/**productController.js** file এ একে invoke করা হবে
> এই parameter টা হচ্ছে প্রতি page এ কতটা করে item দেখাতে হবে তার সংখ্যা । এটা মুলত **frontend** থেকে **productController.js** file হয়ে **apiFeatures.js** file এ আসবে এছাড়া আরো কিছু   data যা **currentPage, skipItem** নির্ণয়ে লাগবে সেগুলোও আসবে **frontend** থেকে

####
> এখানে **pagination()** function এ প্রথমে **currentPage, skipItem** নির্ণয় করব তারপর এগুলোর সাহায্যে **query function** এ **limit().skip()**  method implement করে যা পাব তা **query** keyword এর value হিসেবে assign করে পুরা **this** কেই return করে দিব
>> প্রসংগত আবার মনে করিয়ে দেই  এই **query function** হচ্ছে  **productController.js**  থেকে পাওয়া **productModel.find()** method টা ই

####
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/utils/apiFeatures.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);
    
    
    // this.query = this.query.find(queryCopy); // [[line-30]] this line of code is for strict value filtering but considering rangeable filter like filtering for price range or rating range this line will fail soo need ot comment out and work as bellow


    // Filter For Price and Rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
  
 }

module.exports = ApiFeatures;

```



####
10. এখন আমরা "6PP_ECOMMERCE/backend/controllers/**productController.js "** file এ  **_pagination()_** function কে invoke করব সাথে argument হিসেবে  **_resultPerPage_**  কেও দিয়ে দিব পাশাপাশি **_.countDocuments()_** method use করে **_totalProductsCount_** বের করে নিব

####
>
>> যদিও আপাতত যেহেতু আমরা **frontend** শুরু করি নি তাই **resultPerPage** variable কে static ভাবে declare করেছি কিন্তু পরবর্তিতে এটা **frontend** থেকে আসবে  [[line-61]
>
>> এবং response হিসেবে **_products_** এর পাশাপাশি **_resultPerPage,productsCount_** কেউ পাঠাব

####
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const ApiFeatures = require("../utils/apifeatures");


// create a product - AdminRoute
exports.createProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
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

 const resultPerPage = 8;
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
        resultPerPage,
        productsCount,
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

```

####
11. এবার postman software এ test করব 
####
![postman success screenshot](https://i.ibb.co/M2rxgT3/xcv.png)
####







