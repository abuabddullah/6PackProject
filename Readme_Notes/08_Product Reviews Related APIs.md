## 08_Product Reviews Related APIs

#### createProductReview+updateProductReview etc ....

### createNupdateProductReview : [ 03:47:00 - d56f4gd441df32g4dg4 ]


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
2. এজন্য 6PP_ECOMMERCE/backend/controllers/**productController.js** file এ **_createProductReview_**  নামের async function create করতে হবে যেখানে 6v4654s654s65465f4sd654s6dv4sdf6d
####

> এখানে বেশ কয়েকটা জিনিস কে মাথায় নিয়ে কাজ করতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/productController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
sdf41f65ds4f
```
####

3. এজন্য 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **_createProductReview_**  function কে import করে এর জন্য একটা 65d4fg65df456dfg4456g41fd6
####

> এখানে 465xcf456xdfg4dxf65df56g4ছি

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
654cxvvb41xc56f41d511b145dch
```
####

4. এবার **postman software** দিয়ে project test করার হবে **_createProductReview_** কে
####

####
![postman success screenshot](https://i.ibb.co/TRQ0C6H/Screenshot-1.png)
####




















































































































































### update prod545gb56d4d4dg4165fgb4h46file : [ 03:47:00 - d56f4gd441df32g4dg4 ]

10. এজন্য 6PP_ECOMMERCE/backend/controllers/**productController.js** file এ **_createProductReview_**  নামের async function create করতে হবে যেখানে 6v4654s654s65465f4sd654s6dv4sdf6d
####

> এখানে sd51s41xd65146541s35g

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/controllers/productController.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
sdf41f65ds4f
```
####

11. এজন্য 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **_createProductReview_**  function কে import করে এর জন্য একটা 65d4fg65df456dfg4456g41fd6
####

> এখানে 465xcf456xdfg4dxf65df56g4ছি

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
654cxvvb41xc56f41d511b145dch
```
####

12. এবার **postman software** দিয়ে project test করার হবে **_createProductReview_** কে
####

####
![postman success screenshot](https://i.ibb.co/TRQ0C6H/Screenshot-1.png)
####