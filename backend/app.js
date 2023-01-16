const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");


const app = express();


app.use(cors())
app.use(express.json())
app.use(cookieParser());

// for integrating cloudinary
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());



// Route Imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const errorMiddleware = require("./middleware/error");



// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", paymentRoute);


// last placing Middleware for Errors
app.use(errorMiddleware);


module.exports = app;