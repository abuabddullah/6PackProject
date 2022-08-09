const express = require("express");
const cors = require('cors')
const cookieParser = require("cookie-parser");


const app = express();


app.use(cors())
app.use(express.json())
app.use(cookieParser());



// Route Imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const errorMiddleware = require("./middleware/error");



// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);


// last placing Middleware for Errors
app.use(errorMiddleware);


module.exports = app;