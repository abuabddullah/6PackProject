# Shipping | ConfirmOrder | ProceedPayment

## Frontend

- frontend\src\reducers\productsReducer\ **_cartSlice.js_** এ **saveShippingInfo** নামের নতুন একটা action-function add করা হয়েছে
- checkoutsteps component বানাতে হবে নিচে এর বিস্তারিত বর্ননা আছে
- **Shipping.js** page এ যাব ও **_country-state-city_** packe কে frontend এ install করব
- frontend\src\component\Cart\ **_Shipping.js_** এর মাঝে mainly user এর shpping address কে local storage এ save করা হবে কারন যখন order create করব তখন শিপিং address কে backend এ পাঠাতে হবে এ জন্য পর্যাপ্ত input field নিব তারপর তাতে validation করে **_saveShippingInfo_** action-function কে dispatch করব যার ফলে এই পিসি বা ফোনের জন্য একটা **_shippinng_** address local storage এ saved হয়ে যাবে কিন্তু প্রথমবারের পর থেকে আমরা যতবার এই page এ আসব ততবার input field গুলো fillup দেখব কারন এখানে state management এর সাহায্যে **shippingInfo** state localstorage থেকে data এনে রেখে দেবে যার কারনে আমরা **useState** এ empty string না রেখে **shippingInfo** chaining করেছি
- **_ConfirmOrder.js_** page এ শুধুমাত্র full order details টা আরেক বার summary আকারে দেখাব এর জন্য state থেকে **_userInfo & ShippingInfo_** দরকার পরবে আর **CheckoutSteps** এ **activeStep=1** হবে সবশষে **proceedPayment** button এ click করার ফলে full orederInfo session stoarage saved হবে ও তারপর **payment** page এ routing করবে

- PAYMETNING FUNCTIONALITY (backend):
- Open backend and go to <a hrc="https://dashboard.stripe.com/test/dashboard">stripe website</a> and get the **_private and publishable_** key and assign in config.env variable
- install <a hrc="https://www.npmjs.com/package/stripe"><b>npm i stripe</b></a> in the rooth i.e **_D:\LERN MEARN\6PP_ECOMMERCE_** folder in terminal
- then create **_processPayment_** controller function and routes for this function and also connect in the **_app.js_** file
- **_processPayment_** controller function মূলত frontned থেকে যে মুল্য পেয়েছে(পয়সায় , টাকাতে নয়) তা নিয়ে fixed একটা **_myPayment_** function কে invoke করবে ও successfull payment হলে একটা object return হিসেবে পাবে যার ভিতরের **_client_secret_** কে আমাদের frontend এ response হিসেবে পাঠানো হবে
  -পাশাপাশি **_/stripePublishableApiKey_** route এ ও **_stripePublishableApiKey_** কে আমাদের frontend এ response হিসেবে পাঠানো হবে যদি **stripePublishableApiKey** এর সম্পুর্ন কাজই frontend এ লাগে তারপরও safty এর জন্য config file এ রাখা হচ্ছে

- PAYMETNING FUNCTIONALITY (frontend):
- install <a hrc="https://www.npmjs.com/package/@stripe/react-stripe-js?activeTab=readme"><b>npm install @stripe/react-stripe-js @stripe/stripe-js</b></a> in the rooth i.e **_D:\LERN MEARN\6PP_ECOMMERCE\frontend_** folder in terminal
- get the **_stripePublishableApiKey_** dispatching in **App.js** file by the help of redux in **_paymentSlice.js & paymentActions.js_** file
- then stripe এর default **_Element & loadstripe_** & এ state থেকে প্রাপ্ত **_stripePublishableApiKey_** এর সাহায্যে **App.js** এর ভিতরে একটুখানি **fixed code** লিখতে হবে যার কারনেই মূলত stripe এর form টা কাজ করবে এবং এরভিতরেই **_Payment_** component wrapping করে দিতে হবে
- now create **_Payment_** component for ksdjhljkhksjhjksdhfkjsdhfjksfhkjsdhf

### checkoutsteps

<img src="./../frontend/src/images/CheckoutSteps.png"/>

> > **checkoutsteps** টা মূলত **MUI** এর একটা inbuilt component যা **activeStep** props recieve করে
> >
> > > **Shipping Details** এর জন্য **_activeStep=0_**
> >
> > > **Confirm Order** এর জন্য **_activeStep=1_**
> >
> > > **Payment** এর জন্য **_activeStep=2_**
> >
> > এটাকে build করার জন্য **MUI** এর আরো কিছু fixed components(**Step, StepLabel, Stepper**)+attribute(**alternativeLabel,activeStep,style,active,completed,icon**) দরকার পরে
> >
> > > **Stepper** component নিজে ৩টা attribute recive করে
> > >
> > > > **activeStep** এর value হিসেবে propse এর activeStep কে দিতে হয় কারন এটাই নির্দেশ করে আমি কত নাম্বার steps এ আছি আর কতগুলে step শেষ করেছি
> > >
> > > > আর **style,alternativeLabel** হচ্ছে fixed attr.
> > >
> > > **Step** এর ক্ষেত্রে,
> > >
> > > > **_active,style_** আমাদের styling এ সাহায্যে করে
> > > >
> > > > > বিঃদ্রঃ **checkoutsteps** এর css টা কিন্তু special যেটা সরাসরি **mui** এ component class কে target করে custom styling করা হয়েছে
> > >
> > > **StepLabel** recieve করে **icon** আর steps এর নাম বা **label**
> > >
> > > > **MuiStepConnector-line,MuiStepConnector-root,MuiStepConnector-active,MuiStepConnector-completed** এই css class গুলোই মূলত **mui** এর component class

```http
filepath: frontend\src\component\Cart\CheckoutSteps.js
""""""""""""""""""""""""""""""""""
import React from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Step, StepLabel, Stepper, Typography } from "@mui/material";

const CheckoutSteps = ({activeStep}) => {
  const steps = [
    {
      label: <Typography>Shipping Details</Typography>,
      icon: <LocalShippingIcon />,
    },
    {
      label: <Typography>Confirm Order</Typography>,
      icon: <LibraryAddCheckIcon />,
    },
    {
      label: <Typography>Payment</Typography>,
      icon: <AccountBalanceIcon />,
    },
  ];

  const stepStyles = {
    boxSizing: "border-box",
  };

  return (
    <>
      <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item, index) => (
          <Step
            key={index}
            active={activeStep === index ? true : false}
            completed={activeStep >= index ? true : false}
          >
            <StepLabel
              style={{
                color: activeStep >= index ? "tomato" : "rgba(0, 0, 0, 0.649)",
              }}
              icon={item.icon}
            >
              {item.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckoutSteps;






filepath: frontend\src\component\Cart\CheckoutSteps.css
""""""""""""""""""""""""""""""""""

.MuiStepConnector-line {
  display: none !important;
}

.MuiStepConnector-root {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.349);
}

.MuiStepConnector-active,
.MuiStepConnector-completed {
  background-color: tomato;
}



```

### Shipping.js

```http
filepath : frontend\src\component\Cart\Shipping.js
"""""""""""""""""""""""""""""""
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageTitle from "../layout/PageTitle/PageTitle";
import CheckoutSteps from "./CheckoutSteps";
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { Country, State, City }  from 'country-state-city';
import { saveShippingInfo } from "../../reducers/productsReducer/cartSlice";
import { toast } from "react-toastify";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo?.address);
  const [city, setCity] = useState(shippingInfo?.city);
  const [state, setState] = useState(shippingInfo?.state);
  const [country, setCountry] = useState(shippingInfo?.country);
  const [pinCode, setPinCode] = useState(shippingInfo?.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo);

  const handleShippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 11 || phoneNo.length > 11) {
      toast.error("Phone Number should be 11 digits Long", { id: "shippingDetails_error" });
      return;
    }

    const shippingDetails = {
      address,
      city,
      state,
      country,
      pinCode,
      phoneNo,
    };

    dispatch(saveShippingInfo(shippingDetails));
    navigate("/order/confirm");
  };
  return (
    <>
      <PageTitle title={"Shipping"} />
      <CheckoutSteps activeStep={0} />
      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={handleShippingSubmit}
          >
            <div>
              <HomeIcon />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <LocationCityIcon />
              <input
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <PinDropIcon />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>

            <div>
              <PhoneIcon />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>

            <div>
              <PublicIcon />

              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div>
                <TransferWithinAStationIcon />

                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;




```

## Payment (Backend)

### INSTALL NPM STRIPE

```http
filepath: /d/LERN MEARN/6PP_ECOMMERCE
""""""""""""""""""""""""""""""""""""""""

npm i stripe

```

### config.env

> > go to stripe website and get the **_private and publishable_** key and assign in env variable

```http
filepath: backend\config\config.env
""""""""""""""""""""""""""""""""""""""""

PORT=5000




DB_URI##########################="mongodb+srv://6PP_ECOMMERCE:6PP_ECOMMERCE@cluster0.hj15oxa.mongodb.net/6PP_Ecommerce"
DB_URI##########################="mongodb+srv://6PP_ECOMMERCE:<password>@cluster0.hj15oxa.mongodb.net/6PP_Ecommerce"
DB_URI="mongodb://localhost:27017/Ecommerce"




JWT_SECRET=902c5afe4dd21930d732a3380b9bd69caa751760c43317cb763df12db49c9120c375946f305f3e8833556c7708766e643a280cfe10f3bfeb1fe10f08dfbb92bb
JWT_EXPIRE=5d
COOKIE_EXPIRE=5





SMPT_HOST=smtp.gmail.com
SMPT_PORT##################################=465
SMPT_PORT=587
SMPT_SERVICE=gmail
SMPT_MAIL=asifaowadud@gmail.com
SMPT_PASSWORD=drtlczpynthdmbxw




CLOUDINARY_NAME=dglsw3gml
CLOUDINARY_API_KEY=393288281474652
CLOUDINARY_API_SECRET=PYDhbIQtyacVMPMkSLhFF8kVY7s




FRONTEND_URL = "http://localhost:3000"




STRIPE_PUBLISHABLE_API_KEY=pk_test_51L0mz8C4IDVrgcznLbqLXXayVFuiBQhNv7ouT1ZJjcOqjQTXzqDrYklOGJ956Ure0V1KHUekdi7Hz4TweBSmQdNb00LFLHFL41

STRIPE_SECRET_KEY=sk_test_51L0mz8C4IDVrgcznjJes3WtKlOiKFEsk4RIPj6neZjAiwDvfEqm6EOUSFqUscErRekE7QevGEKBaLK5UBz0iJe0i00XOCONFhE


```

### paymentController.js

```http
filepath: backend\controllers\
""""""""""""""""""""""""""""""""""""""""
const catchAsyncErrorsMiddleware = require("../middleware/catchAsyncErrorsMiddleware");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripePublishableApiKey = catchAsyncErrorsMiddleware(async (req, res, next) => {
  res.status(200).json({ stripePublishableApiKey: process.env.STRIPE_PUBLISHABLE_API_KEY });
});
```

### paymentRoute.js

```http
filepath: backend\routes\paymentRoute.js
""""""""""""""""""""""""""""""""""""""""

const express = require("express");
const { processPayment, sendStripePublishableApiKey } = require("../controllers/paymentController");
const { verifyJWT, verifyUserRole } = require("../middleware/auth");



const router = express.Router();



router.route("/payment/process").post(verifyJWT, processPayment);
router.route("/stripePublishableApiKey").get(verifyJWT, sendStripePublishableApiKey);

module.exports = router;


```

### app.js

```http
filepath: backend\app.js
""""""""""""""""""""""""""""""""""""""""
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


```

## Frontend (Backend)
