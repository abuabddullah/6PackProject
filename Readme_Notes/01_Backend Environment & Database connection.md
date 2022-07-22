

# E-Commerce By 6PP

এই project এ আমি একটি large scale এর e-commerce site বানাব MERN stack দিয়ে যেখানে backend এ extra হিসেবে mongoose থাকবে এবং index.js এ আমরা সব api declare না করে structuredly বিভিন্ন folder এ define করব।\
পাশাপাশি কোন রকম firebase এর help ছাড়াই internal authentication system বানাব। আর frontend এতো নতুন নতুন চমক থাকছেই।


## Project Credit

 - [Channel : 6 Pack Programmer](https://www.youtube.com/c/6PackProgrammer)
 - [Project link : E-Commerce](https://www.youtube.com/watch?v=AN3t-OmdyKA&t=45195s)
 - [Author : Abhi Singh](https://github.com/meabhisingh)

## Backend Environment & Database connection

#### Environment Setup : _Folder বানানো + mongodb, mongoose, dotenv, express etc connect করে project এর foundation ready করা (23:00-37:45)_


1. **"6PP_ECOMMERCE"** নামের একটা parent-folder বানাতে হবে যার ভিতরে Frontend & Backend এর app-folder থাকবে 
2. এবার "6PP_ECOMMERCE" folder এর ভিতরে আরো দুটা folder বানাতে হবে "6PP_ECOMMERCE/**frontend**" & "6PP_ECOMMERCE/**backend**"
3. backend folder এর ভিতরে দুটা file বানাতে হবে "6PP_ECOMMERCE/backend/**server.js**" & "6PP_ECOMMERCE/backend/**app.js**"
4. এবার terminal দিয়ে **"6PP_ECOMMERCE"** folder এ _**npm init**_ command দিতে হবে, package name দিতে হবে **ecommerce**, entry point দিতে হবে **backend/server.js** বাদ বাকি সব step ok ok করে দিতে হবে
####

```http
npm init
package name : ecommerce
entry point : backend/server.js
```

####
5. আবারো terminal দিয়ে "6PP_ECOMMERCE" folder এ npm দিয়ে **express, mongoose, dotenv** install করতে হবে
####

```http
npm i express mongoose dotenv cors
```

####
6. এবার "6PP_ECOMMERCE/backend/**app.js**" file এ **express, cors** কে import করে তা দিয়ে **app** বানিয়ে **_app.use()_** method দিয়ে **_cors() & express.json()_** function কে invoke করে তারপর app কে এই file থেকে **export** করে দিয়ে হবে যাতে অন্য file থেকেও এই app টার access পাওয়া যায়
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/app.js]]
"""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const cors = require('cors')


const app = express();


app.use(cors())
app.use(express.json())


module.exports = app;
```

####
7. এবার backend folder এ একটা config নামের folder বানাতে হবে "6PP_ECOMMERCE/backend/**config**" তার ভিতরে একটা **_.env_** file বানাতে হবে "6PP_ECOMMERCE/backend/config/**config.env**" এবং এই file এ একটা **_PORT_** নামের environment variable বানাতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/config/config.env]]
""""""""""""""""""""""""""""""""""""""""""""""""""""""

PORT=5000
```

####
8. এবার "6PP_ECOMMERCE/backend/**server.js**" file এ **app, dotenv** কে import করে নিতে হবে, তারপর **_dotenv_** কে file এর সাথে connect করে নিতে হবে (_line: 4_) এবং **_app.listen()_** method দিয়ে একটা server establish করতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/server.js]]
""""""""""""""""""""""""""""""""""""""""""""""

const app = require("./app");
const dotenv  = require("dotenv")

//config
dotenv.config({ path: "backend/config/config.env" });

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
```

####
9. এবার nodemon দিয়ে server কে run করার জন্য **_start & start-dev_** scrip add করতে হবে "6PP_ECOMMERCE/**package.json**" file এ
####

```http
[[FILENAME : 6PP_ECOMMERCE/package.json]]
"""""""""""""""""""""""""""""""""""""""""

"start": "node backend/server.js",
"start-dev": "nodemon backend/server.js",
```

#### Backend Route : 

####
10. backend folder এ দুটা নতুন folder বানাতে হবে "6PP_ECOMMERCE/backend/**controllers**" & "6PP_ECOMMERCE/backend/**routes**" তারপর **controllers** folder এ product এর জন্য একটা file বানাতে হবে "6PP_ECOMMERCE/backend/controllers/**productController.js**"
11. **productController** **_API_** এর জন্য **_getAllProducts function_** বানাতে হবে যা **inline exported** হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

// Get All Product
exports.getAllProducts = (req, res) => {
  res.status(200).json({
    success: true,
    message: "getAllProducts route is working",
  });
});
```

####
12. এবার "6PP_ECOMMERCE/backend/**routes**" folder এ **_getAllProducts function_** কে **_get request দিয়ে routing_** করার জন্য জন্য একটা file বানাতে হবে "6PP_ECOMMERCE/backend/routes/**productRoute.js**"
13. "6PP_ECOMMERCE/backend/routes/**productRoute.js**" file এ **express, getAllProducts** কে import করে **express** এর সাহায্যে **_express.Router()_** method দিয়ে **router** create করতে হবে, এরপর **_router.route().get()_** method দিয়ে প্রতিটা **API requests** এর aginst এ route বানাতে হবে এবং সবার নিচে **router** কে exports করে দিতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const {
  getAllProducts,
} = require("../controllers/productController");



const router = express.Router();



router.route("/products").get(getAllProducts);







module.exports = router;
```

####
14. এবার "6PP_ECOMMERCE/backend/**app.js**" file এ **_productRoute_** variable কে import করে তারপর **_app.use()_** method দিয়ে **commonURL & productRoute** সহ invoke করতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/app.js]]
"""""""""""""""""""""""""""""""""""""""""""

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
```

####
15. এবার **nodemon** দিয়ে project run করার জন্য terminal দিয়ে **"6PP_ECOMMERCE"** folder এ _**npm run start-dev**_ command দিতে হবে
####

```http
[[FOLDERNAME : 6PP_ECOMMERCE]]
""""""""""""""""""""""""""""""

npm run start-dev
```

####
16. এবার **postman software** দিয়ে project test করার জন্য **Ecommerce** নামের একটা নতুন collection বানাতে হবে, তারপর সেখানে **_http://localhost:5000//api/v1/products_** link এর against এ একটা **GET request** generate করতে হবে
####

####
![postman success screenshot](https://i.ibb.co/P5hKGfb/Capture.png)

####
#### Connect Database : 

####
17. প্রথমে "6PP_ECOMMERCE/backend/config/**config.env**" file এ **_DB_URI_** নামের আরো একটা environment variable বানাতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/config/config.env]]
""""""""""""""""""""""""""""""""""""""""""""""""""""""

PORT=5000
DB_URI="mongodb://localhost:27017/Ecommerce"
```

####
18. Database connect করার জন্য "6PP_ECOMMERCE/backend/config/**database.js**" নামের একটা file বানাতে হবে, তারপর সেখানে **mongoose** কে import করে নিতে হুবে, এবার **connectDatabase** function এ নিচে দেখানো code এর মত করে **database connect** করে সবার নিচে **connectDatabase** কে এখান থেকে export করে দিতে হবে তবে মনে রাখতে হবে বর্তমান version এ **_useCreateIndex: true_** লিখলে **error* দেয় তাই এই line টাকে **comment out** করে দিতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/config/database.js]]
""""""""""""""""""""""""""""""""""""""""""""""""""""""

const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   // useCreateIndex: true, // this is not supported now
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
        console.log(err);
    });
};

module.exports = connectDatabase;
```

####
19. এবার "6PP_ECOMMERCE/backend/**server.js**" file এ **_connectDatabase_** function কে import করে invoke করে দিতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/server.js]]
""""""""""""""""""""""""""""""""""""""""""""""

const app = require("./app");
const dotenv  = require("dotenv");
const connectDatabase = require("./config/database");

//config
dotenv.config({ path: "backend/config/config.env" });



// Connecting to database
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
```
