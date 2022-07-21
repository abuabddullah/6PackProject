const express = require("express");
const cors = require('cors')


const app = express();


app.use(cors())
app.use(express.json())



// Route Imports
const productRoute = require("./routes/productRoute");



// invoking
app.use("/api/v1", productRoute);


module.exports = app;