## 03_Backend errorhandlling with node.js in built _Error_ method

#### Handle Errors for : Wrong Mongodb Id, async error handleing, Mongoose duplicate key error, Wrong JWT, JWT EXPIRE error, http status code error

### Handling Wrong Mongodb Id error : [01:02:34 - 1:12:10]

####
1. এবার backend folder এর ভিতরে "6PP_ECOMMERCE/backend/**utils**" folder বানিয়ে তার ভিতরে একটা file বানাতে হবে "6PP_ECOMMERCE/backend/utils/**errorhander.js**" নামের
2. এবার এখানে আমরা একটা js class generate করব **ErrorHandler** নামের যা inherited হবে node.js এর  default **_Error_ Class** feature থেকে  , এরপর সবার নিচ থেকে **_ErrorHandler_** class টাকে export করে দিবা যাতে অন্যসব file থেকে এর সাহায্যে আমরা প্রয়োজনিয় error generate করতে পারি।

> **ErrorHandler** class টাতে, **constructor** এর সাহায্যে আমরা error কে  invoke করার  সময়  যে **agrument** হিসেবে **message** & **statusCode** পাঠাব তা recieve করব।
> **super** এর সাহায্যে আমরা  **super or parent class অর্থাত "Error"** Class এর   message show করার যে default **constructor** আছে  তাকে **chile class _ErrorHandler_** এ **inherrit** করেছি
> এখানে **super** বলতে মূলত **parent class** এর constructor কে বুঝায়
> **captureStackTrace** হচ্ছে **"Error"**  Class এর  default function যাকে আমরা  **inherrit** করেছি। এই  **captureStackTrace** function ই মুলত কোন error আসলে তা আমাদের **stack** এ trace করে দেয়  দুটা parameter এর সাহায্যে যার একটি হচ্ছে, **(১) child class নিজেই এক্ষেত্রে "ErrorHandler"** এবং ২য় হচ্ছে, **(২) child class এর constructor**

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
7. এবার **postman software** এ test করব **_mongDb id_** last এর digit 9 কে অন্যকিছু দিয়ে replace করব
####
![postman success screenshot](https://i.ibb.co/9GTfJcd/xcv.png)
####




### Handling asynchronus error : [1:12:10 - 1:16:52]

####
8. এবার **_asynch error_** কে handle করার জন্য  আরো একটা middleware বানাতে হবে 6PP_ECOMMERCE/backend/middleware/**catchAsyncErrorsMiddleware.js** নামের,

> এই **middleware** টা মূলত **parameter** হিসেবে একটা  **function** কে  recieve করবে তারপর  javaScript এর default class **Promise** এর **Promise.resolve().catch()** method এর সাহায্যে যদি কোন error না থাকে তাহলে **try** করবে আর থাকলে **catch** করে **next** করবে

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/middleware/catchAsyncErrorsMiddleware.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const catchAsyncErrorsMiddleware = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};

module.exports = catchAsyncErrorsMiddleware

```

####
9. এবার "6PP_ECOMMERCE/backend/controllers/**productController.js**" file এ **catchAsyncErrorsMiddleware** কে import করে নিয়ে তারপর সবগুলো asynchronus function এর যেখানে আমরা  **_asynch()_** function use করেছিলাম তাকে **_catchAsyncErrorsMiddleware_** দিয়ে নিচের মত মুড়িয়ে দিব,  

> **catchAsyncErrorsMiddleware(async(req,res,next){})**

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");


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
    const products = await productModel.find();
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
10. এবার **postman software** এ test করব
####
![postman success screenshot](https://i.ibb.co/LpQnFPj/xcv.png)
####



### Handling _unhadled promise rejection_ error : [1:16:52 - 1:19:54]

> **_unhadled promise rejection_** error বলতে , কোন কারনে link এ কোণ spelling mistake হয়ে গেলে যাতে server forcedly shut down হয়ে যায় সেই কাজ করা
> **unhadled promise rejection error** কে অবশ্যি 6PP_ECOMMERCE/backend/**server.js** file এর সবার নিচে just **export** করার আগে define করতে হয়

####
11. এজন্য  6PP_ECOMMERCE/backend/**server.js** file এ গিয়ে প্রথমে **_app.listen()_** কে একটা  **_server_** নামের varibale এ রাখব, তারপর **_process.on()_** method এ  **_unhandledRejection_** event use করে  একটা **callback** function input দিব যা প্রয়োজনিয় message **console** করবে, **server** close করবে, **process** exit করবে
####

> **server.close()** method ও একটা **callback** function recieve করবে যেখানে **process.exit()** method invoke 

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/server.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//config
dotenv.config({ path: "backend/config/config.env" });



// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});



// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);  
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});

```

####
10. এবার **terminal** এ test  করার জন্য আগে কিছু error create করতে হবে তাই 6PP_ECOMMERCE/backend/config/**database.js** file এর **_.catch_()**  method কে comment out করে দিব যাতে  error auto  catch  হয় এ solve না হয়ে যায় এবং

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/config/database.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""


const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useCreateIndex: true, // this is not supported now
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    /* .catch((err) => {
        console.log(err);
    }); */
};

module.exports = connectDatabase;
```

#### 

####
11. এবং 6PP_ECOMMERCE/backend/config/**config.env** file এর  **_DB_URI_** variable এর value নষট করে দিব  দেখব **terminal** এ error আসবে

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/config/config.env]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
PORT=5000
DB_URI="mongo://localhost:27017/Ecommerce"
```
#### 

####
![postman success screenshot](https://i.ibb.co/LpQnFPj/xcv.png)
####

####
12. test success হলে again 6PP_ECOMMERCE/backend/config/**config.env** file এর  **_DB_URI_** variable এর value ঠিক করে দিব

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/config/config.env]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
PORT=5000
DB_URI="mongodb://localhost:27017/Ecommerce"
```
#### 



### Handling _uncaught_ error : [1:19:54 - 1:21:53]

> **_uncaught_** error বলতে ,  যদি project এ কোণ  **undefined variable** থাকার কারনে যেই error টা দেয় তাকে handle করতে হবে
> **_uncaught_** কে অবশ্যি 6PP_ECOMMERCE/backend/**server.js** file এর সবার  উপরে define করতে হয়

####
13. এজন্য  6PP_ECOMMERCE/backend/**server.js** file এ গিয়ে  একদম শুরুতে  **_process.on()_** method এ  **_uncaughtException_** event use করে  একটা **callback** function input দিব যা প্রয়োজনিয় message **console** করবে, তারপর **process** exit করবে
####

> **server.close()** method কে invoke  করা লাগবে না

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/server.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//config
dotenv.config({ path: "backend/config/config.env" });



// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});



// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);  
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
```

####
14. এবার **terminal** এ test  করার জন্য আগে কিছু error create করতে হবে তাই 6PP_ECOMMERCE/backend/**server.js** file এ কোণ undefined variable কে  **console** করে দেখা যেতে পারে

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/server.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});


console.log(testUncaughtError)


//config
dotenv.config({ path: "backend/config/config.env" });



// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});



// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);  
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
```

#### 

####
![terminal error screenshot](https://i.ibb.co/7K7Dxv6/xcv.png)
####

####
15. এবং 6PP_ECOMMERCE/backend/**server.js* file এর  *undefined variable কে comment out করে দেই

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/server.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});


// console.log(testUncaughtError)


//config
dotenv.config({ path: "backend/config/config.env" });



// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});



// unHandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);  
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
```
#### 

### Handling _castError_ error : [1:21:53 - 1:24:22]

> **_castError_** error বলতে ,  যদি  mongoDB তে  **_GET req_** করার সময় **id** এর জায়গায় অন্য কিছু দেইয় অথবা **id** shortend হয়ে যায় তখন এই error দেয়


####
16. এজন্য  6PP_ECOMMERCE/backend/middleware/**error.js** file এ গিয়ে  **_errorMiddleware_** এ **_err.stack_** কে console  করে সেখান থেকে **_err.name_** এর উপরে condtion apply করে এই  error টা handle করব
####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/middleware/error.js file]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // console.log(err.stack);
    // Wrong Mongodb Id error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}
module.exports = errorMiddleware;
```

####
![postman screenshot](https://i.ibb.co/pvxZJYg/xcv.png)
####



