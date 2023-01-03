23:00 coding start
33:00 route connected
38:00 connect MongoDB
45:15 product model & schema finished
50:27 CREATE/POST a new product and save in "postman"
01:02:00 READ+UPDATE+DELETE+single product details API creating done and saved in postman
01:17:00 error handling + async error handling middleware done
01:20:00 handling Unhandled Rejection Error by editing app. listen
01:21:56 Uncaught exception or undefined variable error handling done
01:24:13 cast error handling or invalid id or other information error done
_new2me_ 01:35:00 searching effect implemented on GET API
_new2me_ 01:44:57 filtering effect implemented on GET API _01:42:00_ was very important to understand
_new2me_ 01:52:20 pagination effect implemented on GET API
02:00:38 userScema creating done
02:12:00 user registerd and only password hashing-effect done before save
02:17:27 user registerd and jwt-effect done during save
02:31:27 user registerd and token generated and auto saved in coockie
02:38:00 authentication done by jwt after login
02:43:00 log out process done
02:48:00 admin role checking implemented
02:50:40 user id is also added in db during CREAT or POST a product
03:04:27 working on forgot PASS and email template done now need to work with nodemailer and gmail
3:10:37 mailing function done ready to mailing by nodemailer and gmail _but have some error cause email was refused_
3:12:21 error solved by new email but have hacks cause **nodemailer don't work well with GMAIL**
3:13:27 hacks to handle nodemailer vs gmail error is _go to sendemail.js file i.e nodemailer function file and add host:"smtp.gmail.com" and port:465_ as environment variable in config.env file do follow the steps up to 3:15:08
3:22:21 reset password from email link
3:25:18 error handling for already-used-mail + jwt-expired+ jwt invalid
03:29:00 creat route for getting user details
03:33:30 create route for update password
03:37:15 update profile PUT api created
03:37:52 add _'/admin'_ before all the admin route in _productRoute.js_ or _userRoute.js_ file for more visual understanding
03:42:10 get all users and andmin check any user by I'd API created
03:47:00 admin route to update user to admin and admin delete user API created
4:00:43 give review or edit it review+ get avg review of. Product API created
04:02:00 decorating Postman creating new folder
04:08:28 GET all reviews of a product and DELETE any review API created
04:14:30 order schema and model created
04:20:00 create order API created
04:26:00 check my orders, single order details route
04:42:00 get all order,get stock of order, update order status, delete ordervetc
04:46:00 react dependencies and environment setup done
4:51:57 overly nav created and webfont package installed for robot google font
05:06:00 classy home banner with scroll on click effect created
05:12:00 react stars or react rating implemented and options declaration done of it
05:18:00 home.js decorating done
05:20:30 react helmet implementation done now redux going on
_redux_ 05:37:03 proxy added to conn fronted and backed
_redux_ 5:39:50 to prevent this error need close and restart all terminal
_redux_ 5:47:37 product card linking with mongodb done and loading component start
_redux_ 5:51:29 loader making done
_redux_ 5:56:26 react-alert library used in the project index.js file and required file instead of toast
_redux_ 6:01:56 get product details reducer created now need to create route for it
6:11:34 react-material-ui carousel used and _some correction done in backend_
6:37:02 redux implemented and getSingleProductDetails component okay now work on get all product on products route
6:42:30 all products get done in products route now search feature implementing
6:49:49 search implemented with _history.push_ method and _.trim()_ method
6:59:41 react pagination implemented and filter on price-range working on
07:06:06 needed to correct backend for filetr by price range with help of material UI
7:09:40 filter by price-range done now filter by category working on of material UI
7:13:25 filter by category done of material UI
7:18:48 filter by rating done of material UI
7:22:14 error handling starting on filter function
7:25:50 react helmate added on newly created pages and login+register component starting _[login & register will be in same component and there will be sliding effect and useRef will use , function with useRef is used (new to me)]_
7:40:28 login part just design completed and signup design start _enycType (new to me)_ used for uploading pic
_new2me_ 7:46:29 here something _new FileReader()_ function used, readyState used which has 3 state 0,1,2 === req,process,done
_new2me_ 7:47:58 here choose file input type has new effect by css selector _must check_
7:51:52 form both login and register are designed now need to create reducers and connect with backend and activate forgotPass
7:59:48 userReducer creating done and logging effect also done now working on register
8:02:02 cloudnary implementation start new library used in backend _express-file-upload_ to use cloudinary and make sure there is folder in media library 8:04:47
8:05:33 register effect done now need to work in user info update and loading
8:09:46 loaduser reducer created done
8:11:00 _store.dispatch()_ new method used, login page protected when already user logged in
8:23:08 dropdown effect by _material ui_ function for admin role and _useHistory _ used
8:27:33 logout effect done
8:32:50 overlay effect done on hoovering profile icon and working on Profile component *need to correct in backend for *createdAt**
8:41:48 working on profile compo but a problem due to not having protected routing so now need to work on protected route
8:45:18 protected route created and applied on Profile compo in app.js file
8:45:29 Profile compo complete now working in backend for createdAt
8:46:41 _createdAt_ done now need to work on updating profile
9:11:45 update profile done and 9:06:26 has error of _setEmail_ , 9:09:14 need to work in backend for cloudnary for update profile
9:23:19 change pass done now work on _forgot password_
9:33:39 forgot pass related design+link sent on the email done now need to create capability to change pass by creating forgotpassReducer _with the help of backend 9:43:31_ here we need to replace the _protocol with forntend_url _(just for now during deploy we will need the protocol code again)**
9:47:30 forgotpass done basically its like generating an email containing a link , clicking the link will take us to the change pass route now _working on cart component_
10:17:13 cart component shaping done
10:31:47 _tooltipOpen_ attribute used on profile dropdown to see the title of icons
10:34:46 _reduce()_ function is used to calculate the total amount in cart component
10:35:38 cart related task done now working on _shipping details for payment methods_
at 10:36:03 _history+redirect_ is used and at 10:36:53 on login page navigate link _"/account"_ is changed to a _redirect_ variable with a search parameter
10:38:57 reducer 4 shipping creating with cart reducer file
10:41:16 _react country-state library _ installing for having all the country for payment
10:51:41 styling done new attribute got from mateerialUI _checkout step + activestep_ on which now working on
11:00:11 shipping details done now working on _confirm order of payment_
11:10:23 confirm order done now working on _proceed to payment_ at 11:10:49 we need to work on backend for integrating _stripe js_ so follow the instruction about stripe secret code
11:12:27 install _stripe_ at root folder for backend and at 11:15:58 backend API creating until now okay later need to update now working on frontend
11:17:40 install _react-stripe-js_ in front end
11:21:40 working with stripe js in frontend start
11:30:20 payment with stripe is completed now need to work on some error handles like restricting double payment for the same order and _success component_ design.
11:38:02 payment related task done now working on order and user reviews
11:44:07 new library of MUI is installed for working on MyOrder compo paginition,table,filtering
11:50:58 filter , sorting slightly ready in MyOrder compo table and creating function in obj 11:52:22
11:58:09 MY OREDERS COMPO done now working on singleOrderDetails
12:07:34 here react-router's _switch compo_ is used
12:09:13 a bug found _still able to add cart of stock out product_ need to fix it in _productDetils.js _ file
12:09:53 order details done+bug done now work on review
12:14:43 here the _rating compo_ is of MUI
12:27:43 done review part just _replace react-rating with MUI Rating compo_
12:30:50 uninstalling react-rating cause using MUI rating compo
12:33:15 review done now work on admin protected routes

## All .env variables

####

![postman success screenshot](https://i.ibb.co/LRbw4D3/Screenshot-2.png)

####

## 10_Document Title

### KeyWord : [timestart - timeEnd]

> > _details details details details details details details details_
>
> > _details details details details details details details details_

1. steps steps steps steps steps steps steps steps steps steps steps steps steps steps steps

####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/path/path.js]
""""""""""""""""""""""""""""""""""""""""""""""""""
npm i express mongoose dotenv cors
```

####

2. imgCaption imgCaption imgCaption imgCaption imgCaption imgCaption imgCaption imgCaption

####

####

![postman success screenshot](https://i.ibb.co/B3cPbkD/Screenshot-1.png)

####
