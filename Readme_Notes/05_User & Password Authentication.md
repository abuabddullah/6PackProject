## 05_User & Password Authentication

#### xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

### User Schema creating : [ 01:52:20 - 02:00:38 ]

> সর্ব প্রথম কিছু **react libraries** download করতে হবে যা আমাদের user information safe করতে, কিছু কিছু informations কে save করেতে , mailing করতে help করবে

####
1. এজন্য cmd দিয়ে base folder টার terminal খুলে সেখানে libraries গুলাকে install করে নিতে হবে
####

####
> এখানে **bcryptjs** এর সাহায্যে database এ user এর password টা **hashing** হয়ে saved হবে তাই admin ও চাইল user এর password পড়তে পারবে না
> এখানে **jsonwebtoken** এর সাহায্যে token generate হবে যা আমাদের authorized user কে identify করতে সাহায্য করবে
> এখানে **validator** এর সাহায্যে email, password ets field কে validate করা হবে যাতে user থেকে exactly true information পাওয়া যায় 
> এখানে **nodemailer** এর সাহায্যে email, password, change password related কাজ যা emailing এর সাহয্যে করা হয় তা আমরা করতে পারব
> এখানে **cookie-parser** এর সাহায্যে jsonwebtoken কে backend server এ save করব frontend এর local storage এ save করা less secured
> এখানে **body-parser** এর সাহায্যে email, password, change password related কাজ যা emailing এর সাহয্যে করা হয় তা আমরা করতে পারব
####
####

```http
[[FOLDERNAME : 6PP_ECOMMERCE]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
npm i bcryptjs jsonwebtoken validator nodemailer cookie-parser body-parser
```
####

2. এবার "6PP_ECOMMERCE/backend/**models**" folder এর ভিতরে "6PP_ECOMMERCE/backend/models/**userModel.js**" file বানাতে হবে এবং
3. "6PP_ECOMMERCE/backend/models/**userModel.js**" file এ **mongoose, validator** কে import করে নিব, তারপর **_mongoose.schema()_** method দিয়ে **user** এর schema বা কংকাল বানাতে হবে যেখানে **userSchema** object এর সকল **key-value** এর বৈশিষ্ট define করা থাকবে, এরপর সবার নিচে **collection Name, schema name** সহ **_mongoose.model()_** method এর সাহায্যে **model** টা বানিয়ে **inline exports** করে দিব।

> মনে রাখতে হবে, 
> basically এই model গুলোই মূলত mongodb এর **collection** এর মত কাজ করে  আর 
> **collection name** অবশ্যই singular form এ দিতে হবে 
>
> **userSchema** এর **email.unique = true** এর মানে হচ্ছে user এর collection এ একই email এর agianst এ কেবল একজনই এবই কেবল মাত্র সেই ব্যক্তিই থাকবে
> **userSchema** এর **email.validate[0] = validator.isEmail** এটা হচ্ছে **validator** library আমাদের justify করে দিচ্ছে যে email টা কি সত্যিই valid কিনা
> **userSchema** এর **password.select = false** এটা হচ্ছে যদি admin কখনো কোন specific user এর details অথবা সব গুলো users information কে **GET** করতে চায় তাহলে এই password এর **select** key false হওয়াতে সে কিছুতেই user এর password কে **GET** করেতে পারবে না বাকি সব পারবে
> **userSchema** এর **avatar** এটা হচ্ছে একটা object **{}** কারন user এর profile pic একটাই থাকে

####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/models/userModel.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const mongoose = require("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
```
####



### Creating user cotroller,routes and POST req for registering a user  : [ 02:00:38 - 2:08:10 ]
####
4. এবার "6PP_ECOMMERCE/backend/**controllers**" folder এ "6PP_ECOMMERCE/backend/controllers/**userController.js**" file create করে এর ভিতরে **userModel, errorhander, catchAsyncErrors** কে import করে নিয়ে তারপর **registerUser** নামের asynchronus function generate করতে হবে
####

> user এর সব informations **body** এর সাহায্যে frontend থেকে backend এ আসবে আর **avatar** টা মূলত **cloudnary** এর সাহায্যে frontend থেকে backend এ আসবে এখন পর্যন্ত আমরা cloudnary নিয়ে কোন কাজ করিনি তাই একটা demo avatar set করে রেখেছি

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/userController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const userModel = require("../models/userModel");


// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "myCloud.public_id",
      url: "myCloud.secure_url",
    },
  });
  
    res.status(201).json({
        success: true,
        message: "user is created",
        user,
    });
});
```
####

5. এবার **registerUser** function এর router বানানোর জন্য "6PP_ECOMMERCE/backend/routes/**userRoute.js**" file create করে তাতে **express, registerUser** function কে import করে **_router.route().post()_** method দিয়ে আরেকটা নতুন **POST API** এর route বানাতে হবে এবং সব শেষে **router** কে exporst করে দিতে হবে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const express = require("express");
const {
  registerUser,
} = require("../controllers/userController");

const router = express.Router();


router.route("/register").post(registerUser);
module.exports = router;
```
####


6. এবার 6PP_ECOMMERCE/backend/**app.js** file এ **userRoute** কে import করে তারপর app.use() method দিয়ে commonURL & productRoute সহ invoke করতে হবে।
>এই commonURL[**"/api/v1"**] সব সময় url এর সাথে fixed থাকে
####

```http
[[FILENAME : 6PP_ECOMMERCE/backend/app.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const cors = require('cors')


const app = express();


app.use(cors())
app.use(express.json())



// Route Imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const errorMiddleware = require("./middleware/error");



// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);


// last placing Middleware for Errors
app.use(errorMiddleware);


module.exports = app;
```
####

7. এবার **postman software** দিয়ে project test করার জন্য **Ecommerce** collection এ **_http://localhost:5000/api/v1/register_** link এর against এ **body** তে **json** format এ একটা **POST request** generate করতে হবে **registerUser** function এর জন্য
####

####
![postman success screenshot](https://i.ibb.co/G7nGcYZ/xcv.png)
####


### Encrypting password during registering and if password is changed : [ 2:08:10 - 2:12:28]
####
8. এবার "6PP_ECOMMERCE/backend/models/**userModel.js**" file এ **bcryptjs** কে import করব তারপর **_userSchema_** এর উপরে **_"save"_** event apply করে একটা asynchronous analog function pass করব যা **_next_** function কে parameter হিসেবে নিবে এবং যদি password change করা হয়  অথবা user firstime register হয়  তাহলেই কেবল password **_hashing_** হবে নইলে **_next()_** function invoke হবে
####

> এখানে **_.pre()_** function mean করে হচ্ছে যদি কোন কারনে **_userSchema_** এর যেকোণ data change হয় তাহলে তা save হবার পূর্বেই যেন **hasing** কাজটা হয় আর analog function use করা হয়েছে কারন arrow function এ **this** keyword use করা যায় না
>
> this.isModified("password") method আমাদেরকে this বা **holder object** এর **_password_** field এর কোন modification হয়েছে কিনা তা track করতে সাহায্য করে 
> bcrypt.hash() method আমাদেরকে encrypting এ সাহায্যে করে , এটা দুটা parameter নেয় একটা হল কোণ জিনিসকে **hashing** করা লাগবে আর ২য় হচ্ছে **hashing** এর streng কত হবে এক্ষেত্রে দেয়া হয়েছে **১০**
####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/models/userModel.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// hasing or encrypting password befor saving modification
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
```
####

9. এবার **postman software** দিয়ে project test করার হবে
####

####
![postman success screenshot](https://i.ibb.co/3ySR4wm/xcv.png)
####



### JWT impelementing : [2:12:28 - 2:17:20]
####
10. প্রথমে **JWT_SECRET & JWT_EXPIRE** এর জন্য দুটা **environment** variable বানাতে হবে 6PP_ECOMMERCE/backend/config/**config.env** file এ  
####

> JWT_SECRET generate করার জন্য আমরা terminal এর node এ **require('crypto').randomBytes(64).toString('hex')** এই code use করব

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/config.env]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

PORT=5000
DB_URI="mongodb://localhost:27017/Ecommerce"
JWT_SECRET=902c5afe4dd21930d732a3380b9bd69caa751760c43317cb763df12db49c9120c375946f305f3e8833556c7708766e643a280cfe10f3bfeb1fe10f08dfbb92bb
JWT_EXPIRE=1d
```
####

####
11. এবার 6PP_ECOMMERCE/backend/models/**userModel.js** file এ **jsonwebtoken** কে import করে তারপর **_userSchema_** এর ভিতরে methods হসেবে **getJWTToken** function কে push করে দিব যা মূলত **_jwt.sign()_** method এর সাহায্যে **json web token** generate করে পাশাপাশি তা return ও করবে
####

> **jwt.sign()** method 3 তা parameter নেয় id, jwt_secret আর options এখানে option দেয়া আছে **expire**

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/models/userModel.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// hasing or encrypting password befor saving modification
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
});


// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};



const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
```
####

####
12. এবার 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ **getJWTToken** কে invoke করে **token** নিয়ে হবে এবং সব শেষে তা response এও দিয়ে দিতে হবে
####

> এই **getJWTToken** function টা **line-7** userShcema এর সাহায্যে **_user_** varibale এর ভিতরে already রয়েছে তাই import করা লাগে নি

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/userController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

// Register a User
exports.registerUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { name, email, password } = req.body;
  
    const user = await userModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: "myCloud.public_id",
        url: "myCloud.secure_url",
      },
    });

    const token = await user.getJWTToken()
    
      res.status(201).json({
          success: true,
          message: "user is created",
          token,
          user,
      });
  });
```
####

12. এবার **postman software** দিয়ে project test করার হবে
####

####
![postman success screenshot](https://i.ibb.co/Vpptt71/xcv.png)
####




### "POST Login function" and create "common response sending function" and "function to save token to coocke" in backend : [2:17:20 - 2:31:16]
####
13. 6PP_ECOMMERCE/backend/models/**userModel.js** file এ গিয়ে এবার **User login** করার সময় যে password দিচ্ছে আর আমাদের database এ সেই email এর against এ যে password আছে তা same কিনা check করার জন্য **_UserShema.methods.comparePassword()_** নামের একটা function বানাব যা bcryptjs এর default **_compare_** method এর সাহায্যে এই কাজকে সহজেই করে দিবে
####

> এখানে **bcryptjs.compare()** method টা দুটা parameter নেয় প্রথমটা হচ্ছে login in এর সময় user যে password টা দিচ্ছে আর ২য় টা হচ্ছে সেই email এর against এ database এ যে password আছে তা এবং return result হিসেবে এই function **boolean** value **true or false** কে return করে

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/models/userModel.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// hasing or encrypting password befor saving modification
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
});


// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};



const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
```
####


14. 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ গিয়ে এবার **loginUser** নামের আরো একটা async function বানাতে হবে যা আমাদের user কে login করাবে website এ
####

> line-39 এ আমাদের **findOne()** method implement করার পরে **.select("+password")** কে inclue করা হয়েছে কারন আমরা আগেই যখন **userSchema** define করেছিলাম তখন **userSchema.password.select: false** করেছিলাম যাতে কেউ যদি user এর কোন information কে **GET** করতে চায় তাহলে সব info পেলেও যাতে password না পায় কিন্তু এখানে যখন user **logiin** হচ্ছে ্তখন তার login কে successful করার জন্য **password** টাও কিন্তু লাগবে তাই এই **.select("+password")** method দিয়ে আমি database কে বলে দিচ্ছি, **"শুনো user কে find করে তার সব info দাও এবং পাশাপাশি তার password টাও দিতে হবে বুঝলা?"**
> 
> আর **comparePassword** function টা **userModel** এর সাহায্যে already **user** variable এর ভিতরে ঢুকে গিয়েছে তাই import করা লাগে নাই

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/userController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

// Register a User
exports.registerUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { name, email, password } = req.body;
  
    const user = await userModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: "myCloud.public_id",
        url: "myCloud.secure_url",
      },
    });

    const token = user.getJWTToken();
    
      res.status(201).json({
          success: true,
          message: "user is created",
          token,
          user,
      });
  });

  // Login User
  exports.loginUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
  
    const user = await userModel.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const token = user.getJWTToken();
    
    res.status(200).json({
      success: true,
      message: "user is logged in",
      token,
      user,
    });
  });
```
####

####
15. এবার **loginUser** function এর router বানানোর জন্য "6PP_ECOMMERCE/backend/routes/**userRoute.js**" file এ **loginUser** function কে import করে router.route().post() method দিয়ে আরেকটা নতুন POST API এর route বানাতে হবে 
####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);


module.exports = router;
```
####

16. এবার **postman software** দিয়ে project test করার হবে
####

####
![postman success screenshot](https://i.ibb.co/3cSK22P/xcv.png)
####

####
17. এবার একটা common function বানাব যার সাহায্যে যদি user **login/register/updateinfo** etc করতে চায় তাহলে সে auto token পাবে, token টা coockie তে saved হবে এবং পাশাপাশি auto res send হবে frontend এ । এর জন্য প্রথমে একতা file create করে নিতে হবে **utils** folder এ 6PP_ECOMMERCE/backend/utils/**jwtToken.js** নামের
18. এখন **jwtToken.js** file এ **sendToken** নামের একটা function create করতে হবে যা ৩ টা parameter recieve করবে user, statusCode এবং res 
19. এরপর এই **sendToken** function ৩টা কাজ কয়েক্টা কাজ হবে এবং সব শেষে এই **sendToken** function কে exports করে দিতে হবে

> **user.getJWTToken()** এর সাহায্যে jwt token কে recieve করে **token** নামক variable এ assign করে দিব
> **cookie** তে token কে save করার জন্য 3টা mendatory parameter লাগে **storeageName**, **what to store**(এক্ষেত্রে **toke**) আর **options** লাগে যেখানে token টা কতদিন পর expire হবে, এরকম আরো কিছু (যদি চাই) আর অবশ্যই **httpOnly: true** করে দিতে হয় । তাই এই features সম্বনিত একটা **options** নামের object variable create করব
> **res.status().coockie().json({})** এর সাহায্যে token **cookie** তে save  হবে পাশাপাশি frontend এ response ও send হবে
>
>> এখানে এখনো  **COOKIE_EXPIRE** environment variable বানানো নাই এখন বানাতে হবে
>> **expire** date এ current **login/register/updateInfo** time এর সাথে **COOKIE_EXPIRE** এর duration কে mili second format এ store করতে হয়

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/utils/jwtToken.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
```
####


20. এবার COOKIE_EXPIRE এর জন্য environment variable বানাতে হবে 6PP_ECOMMERCE/backend/config/config.env file এ

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/config.env]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

PORT=5000
DB_URI="mongodb://localhost:27017/Ecommerce"
JWT_SECRET=902c5afe4dd21930d732a3380b9bd69caa751760c43317cb763df12db49c9120c375946f305f3e8833556c7708766e643a280cfe10f3bfeb1fe10f08dfbb92bb
JWT_EXPIRE=5d
COOKIE_EXPIRE=5
```
####


22. এবার 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ **sendToken** কে import করে নিব তারপর **loginUser,registerUser** function এর শেষে যেখানে **token** কে get করা হয়েছে এবং অথবা res কে send করা হয়েছে সেখানে এদের replace করে **sendToken** function use করবে 

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/userController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const sendToken = require("../utils/jwtToken");

// Register a User
exports.registerUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { name, email, password } = req.body;
  
    const user = await userModel.create({
      name,
      email,
      password,
      avatar: {
        public_id: "myCloud.public_id",
        url: "myCloud.secure_url",
      },
    });

    /* const token = user.getJWTToken();    
      res.status(201).json({
          success: true,
          message: "user is created",
          token,
          user,
      }); */

      
    sendToken(user, 201, res);


  });

  // Login User
  exports.loginUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
  
    const user = await userModel.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }


    /* const token = user.getJWTToken();    
    res.status(200).json({
      success: true,
      message: "user is logged in",
      token,
      user,
    }); */

    
    sendToken(user, 200, res);
  });
```
####

23. এবার **postman software** দিয়ে project test করার হবে **coockie** কে
####

####
![postman success screenshot](https://i.ibb.co/PTHQwV0/xcv.png)
####
