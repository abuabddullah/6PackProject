## 05_User & Password Authentication & tracking product creator id

#### userSchema,register,login,logout,verifyJWT,verifyUserRole etc ....

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
> এখানে **cookie-parser** এর সাহায্যে jsonwebtoken কে backend server এ save করব frontend এর local storage এ save করা less secured তাই আমরা **cookie** তে save করব কিন্তু আবার যখন user এর autentication check করা লাগবে তখন এই **cookie-parser** token কে cookie থেকে parse করে আমাদের দিবে
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

12. এবার **postman software & jwt.io website** দিয়ে project test করার হবে
####

> এই প্রজেক্ট এ কিন্তু **getJWTToken** function এর **jwt.sign()** method এ আমরা **email** দেইনি দিয়েছি **id** তাই **docoded()** method যখন apply হবে তখন আমরা result এ {"id", "iat", "exp"} ই পাব অন্য দিকে **"Jhankar vai"** এর project এ আমরা **email** use করেছিলাম তাই {"email", "iat", "exp"} পেয়েছিলাম

####
![postman success screenshot](https://i.ibb.co/Vpptt71/xcv.png)
####
![postman success screenshot](https://i.ibb.co/JcG8qHc/xcv.png)
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


### Creating logOut function in controller file : [2:38:18 - 2:41:17]

> video তে **logOut** function এর আগে **verifyJWT** function create করেছে কিন্তু আমি আগে **logout** function দিচ্ছি কারন **verifyJWT** function কে test করতে গেলে logout এর দরকার পরে

####
24. 6PP_ECOMMERCE/backend/controllers/**userController.js** file এ গিয়ে **logoutUser** নামের একটা async function বানাব যেখানে প্রথমে **res** হিসেবে **cookie** এর token এর value কে null করে দিব । আর তার option এর expired করে দিব শেষে একটা message **res** হিসেবে send করে দিব
####

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/userController.js]]

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


// logout user
exports.logoutUser = catchAsyncErrorsMiddleware(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });


  res.status(200).json({
    success: true,
    message: "user is logged out",
  });
});
```
####
25. 6PP_ECOMMERCE/backend/routes/**userRoute.js** file এ গিয়ে **logoutUser** এর জন্য একটা **_router.route().get()_** নামের **GET** req বানাব
####

> **_pHero_** তে এগুলো আমরা **firebase** দিয়ে করেছিলাম

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/userRoute.js]]

const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/userController");

const router = express.Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);


module.exports = router;
```
####

26. এবার **postman software** দিয়ে project test করার হবে **logoutUser** কে
####

####
![postman success screenshot](https://i.ibb.co/NYKTR7Q/xcv.png)
####





### Creating protected route by verifyJWT function to identify authenticated users : [2:31:16 - 2:38:18,logooutUser, 2:41:17 - 645ghb463d4h65gh4]

> ধরেন আপনি কেবল মাত্র যারা logged in কেবল তাদের কেই **_updateProduct,deleteProduct_** এর access দিবেন তাহলে কি করতে হবে?
>> একটা **_verifyJWT_** function বানিয়ে routing করার সময় **_updateProduct,deleteProduct_** এর আগে **_verifyJWT_** কে বসিয়ে দিতে হবে

####
27. 6PP_ECOMMERCE/backend/**app.js** file এ গিয়ে **cookie-parser** কে import করে নিব তারপর **_app.use()_** method এর সাহায্যে **cookie-parser** কে *middleweare** হিসেবে invoke করব
####

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/app.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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
const errorMiddleware = require("./middleware/error");



// invoking
app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);


// last placing Middleware for Errors
app.use(errorMiddleware);


module.exports = app;
```
####


28. 6PP_ECOMMERCE/backend/**middleware** folder এ গিয়ে authenticated or loggedIn user identify করার function code করার জন্য 6PP_ECOMMERCE/backend/middleware/**auth.js** নামের একটা file বানাবো
####

> basically এখানেও **controller** functions গুলার মত function বানাব কিন্তু এদের কাজ যেহেতু শুধু user, user-power identify করা তাই আলাদা জায়গায় করা হচ্ছে

####
29. এবার 6PP_ECOMMERCE/backend/middleware/**auth.js** file এ **_verifyJWT_** নামের একটা async function বানাব যেখানে **_req.cookies_** থেকে আমরা **_token_** টাকে বের করে নিব আর তারপর একে **_jwt.verify()_** method এর সাহায্যে **decode** করে তা **_decodedData_** নামের variable এ assign করব তার পর database collection or model এ **.findById()** method এর সাহায্যে **id** দিয়ে userInfo কে বের করে এনে **req** এর ভিতরে **_user_** key create করে তার value হিসবে userInfo কে push করে দিব আর সব শেষে **_next()_** function কে invoke করব
####

> আর হ্যা, এক্ষেত্রে প্রজনিয় সব কিছু(jwt, userModel, ErrorHandler, catchAsyncErrorsMiddleware) কে আগেই import করে নিতে হবে
> এখানে যে **next()** function কে invoke করা হয়েছে এর কাজ হচ্ছে verifing এর কাজ শেষ হয়ে গেল **router** folder এ routing এর সময় যে যে route এ **_verifyJWT_** function কে use করা হয়েছে তার immidiate পরেরে function এর কাজ শুরু করা
>> এই function এর সব কাজ আমরা **_pHero_** তে করেছি শুধু মাত্র token টা এখানে আমরা backend এই cookie থেকে বের করে নিয়েছি আর **jhankar** ভাই frontend থেকে body তে করে **_API_** req এর সময় পাঠিয়ে দিতেন 

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/middleware/auth.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrorsMiddleware = require("./catchAsyncErrorsMiddleware");

exports.verifyJWT = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // it returns {"id", "iat", "exp"}
    const userInfo = await userModel.findById(decodedData.id);
    req.user = userInfo;
    next();
})
```
####

30. এবার test করার জন্য 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **verifyJWT** কে import করে তারপর আগের **updateProduct,deleteProduct** function এর route এর আগে  **verifyJWT** বসিয়ে দিব যার ফলে route গুলো protected route হয়ে যাবে
####

> 

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails,
} = require("../controllers/productController");
const { verifyJWT } = require("../middleware/auth");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(verifyJWT,createProduct); // AdminRoute

// router.route("/admin/product/:id").put(verifyJWT,updateProduct).delete(verifyJWT,deleteProduct).get(getProductDetails); // allowed
router.route("/admin/product/:id").put(verifyJWT,updateProduct).delete(verifyJWT,deleteProduct) // AdminRoute
router.route("/product/:id").get(getProductDetails);






module.exports = router;
```
####

31. এবার **postman software** দিয়ে project test করার হবে **verifyJWT** কে
####

####
![postman success screenshot](https://i.ibb.co/vZPLTxS/xcv.png)
####




### Creating protected route by verifyUserRole function to identify Admin users : [2:41:17 - 2:47:44]

> ধরেন আপনি কেবল মাত্র যারা logged in এবং admin কেবল তাদের কেই **_updateProduct,deleteProduct_** এর access দিবেন তাহলে কি করতে হবে?
>> আরো একটা **_verifyUserRole_** function বানিয়ে routing করার সময় **_verifyJWT_** এর পরে কিন্তু **_updateProduct,deleteProduct_** এর আগে **_verifyUserRole_** কে বসিয়ে দিতে হবে

####
32. এবার 6PP_ECOMMERCE/backend/middleware/**auth.js** file এ **_verifyUserRole_** নামের একটা async function বানাব যেখানে parameter হিসেবে **_"admin"_** role কে পাব এবার এর ভিতরে check করব parameter এর role কি database এর user এর role কিনা **যদি না থাকে** তাহলে **_error message_** কে res হিসেবে পাঠিয়ে দিব আর **যদি থাকে** তাহলে **_next()_** function কে invoke করব

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/middleware/auth.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrorsMiddleware = require("./catchAsyncErrorsMiddleware");

// verify log in and token generation
exports.verifyJWT = catchAsyncErrorsMiddleware(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); // it returns {"id", "iat", "exp"}
    const userInfo = await userModel.findById(decodedData.id);
    req.user = userInfo;
    next();
})

// verfy user role "admin"
exports.verifyUserRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resouce `,403));
        }
        next();
    };
};
```
####

33. এবার test করার জন্য 6PP_ECOMMERCE/backend/routes/**productRoute.js** file এ **_verifyJWT_** এর পরে কিন্তু **_updateProduct,deleteProduct_** এর আগে **_verifyUserRole_** কে বসিয়ে দিতে হবে
####

> বিস্তারিত বর্ণনা ঃ router.route("/admin/product/new").post(verifyJWT,verifyUserRole,createProduct)
>
>> উপরোক্ত route টি থেকে আমরা আন্দাজ করতে পারি যে যদি কোন একটা নতুন product কে database এ create করতে চাই তাহলে user কে একাধারে logged-In থাকতে হবে ও পাশাপাশি তার role ও admin হতে হবে যা এই দু **verifyJWT,verifyUserRole** functioin দ্বারা identify করা হচ্ছে। 
>
> Wroking Process :
>> প্রথমে user কোন protected route এ ঢুকতে গেলে আগে তার logging-in verification হবে **verifyJWT** function এ এখানে শুরুতে **res.cookies** থেকে token টা নিয়ে সেটাকে **docode** করে user এর **id** কে বের করে আনা হবে তার পর database থেকে এই **id** এর সাপেক্ষে **.findById()** method দিয়ে user এর info কে বের করে নিয়ে **req** এর ভিতরে **user** key তে save করে নেয়া হবে । এরপর **next()** function কে invoke করে route এর immidiate function কে **verifyUserRole** এর কাছে হস্তান্তর করা হবে এটা check করার জন্য যে user কি admin কিনা? এবার সেখান থেকে একটা callback function কে return করতে হবে
>
>>> একটা জিনিস মনে রাখতে হবে যে সর্ববাম থেকে ডানের দিকে যত function আসতে থাকবে তারা তার postion এর পূর্বের সকল function এ ঘটিত updated info গুলো পাবে। যেমন, **verifyJWT** function এ **req** এর ভিতরে **user** key set করে দেয়াতে তার পরবর্তি **verifyUserRole,createProduct** functions দুটো **req.user** এর access পাবে
>
>> এবার **verifyUserRole** এর ভিতরের callback function এ conditioning করতে হবে যে parameter এর role ও database এর user এর একই কিনা **যদি না থাকে** তাহলে **_error message_** কে res হিসেবে পাঠিয়ে দিব আর **যদি থাকে** তাহলে **_next()_** function কে invoke করব । এবার এই **next()** function কে invoke করে route এর immidiate function কে **createProduct** এর কাছে হস্তান্তর করা হবে

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/routes/productRoute.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const {
  getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails,
} = require("../controllers/productController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");



const router = express.Router();



router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(verifyJWT,verifyUserRole("admin"),createProduct); // AdminRoute

// router.route("/product/:id").put(verifyJWT,verifyUserRole("admin"),updateProduct).delete(verifyJWT,verifyUserRole("admin"),deleteProduct).get(getProductDetails); // allowed
router.route("/admin/product/:id").put(verifyJWT,verifyUserRole("admin"),updateProduct).delete(verifyJWT,verifyUserRole("admin"),deleteProduct) // AdminRoute
router.route("/product/:id").get(getProductDetails);






module.exports = router;
```
####

34. এবার **postman software** দিয়ে project test করার হবে **verifyUserRole** কে
####

####
![postman success screenshot](https://i.ibb.co/q54WFMy/xcv.png)
####


### Tracking product creator userInfo in db : [2:47:44 - 2:50:25]

> এতক্ষন আমদের 6PP_ECOMMERCE/backend/models/**productModel.js** file এর productSchema তে ক product টাকে create করল তার **id**/email ও save করে রাখব

####
35. এবার 6PP_ECOMMERCE/backend/models/**productModel.js** file এর productSchema তে যে user এর skeleton টা comment out করা ছিল এখন একে uncomment করে database এ user এর **id** saving এর ব্যবস্থা করে দিব

> এখানে user এর type **string** এর বদলে **mongoose.Schema.ObjectId** set করা হয়েছে কারন আমরা জানি monodb তে id **ObjectId** দিয়ে মুড়ানো থাকে
>
>> এখানে user এর schema বানাতে যে **ref: "User"** করা হয়েছে তা আমি বুঝিনি

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/models/productModel.js]]
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

36. এবার 6PP_ECOMMERCE/backend/controllers/**productController.js** file এর **createProduct** function এ database এ product create করার আগে **req.user** থেকে user এর **id** টাকে নিয়ে **req.body.user** এ save করে দিব
####

> উল্লেখ্য এখানে **req.body** এর সব information frontend থেকে পেলেও নতুন করে **req.body** তে একটা **user** নামের key generate করে তার value হিসেবে routes এর সময় **verifyJWT** থেকে সৃষ্ট **req.user** এর শুধু **id** কে নেয়া হয়েছে

####
```http
[[FILENAME : 6PP_ECOMMERCE/backend/controllers/productController.js]]
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
const ApiFeatures = require("../utils/apiFeatures");
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");


// create a product - AdminRoute
exports.createProduct = catchAsyncErrorsMiddleware(async (req, res, next) => {
    req.body.user = req.user.id; // verifyJWT থেকে প্রাপ্ত
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

    const resultPerPage = 2;
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

37. এবার **postman software** দিয়ে project test করার হবে **user সহ product** কে
####

####
![postman success screenshot](https://i.ibb.co/1MMTrPk/xcv.png)
####




