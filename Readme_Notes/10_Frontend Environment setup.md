## 10_Frontend Environment setup

### Frontend Setup : [04:42:00 - 04:46:00]
> _creating react app,_
 

>
>> এখানে **_creat-react-app_** command এর পরে কোণ folder এর নাম না দিয়ে **_dot(.)_** দেয়া হয়েছে যার ফলে react-app টা সরাসরি এই "6PP_ECOMMERCE/**_fronend_**" folder এই install হবে


1. terminal দিয়ে "6PP_ECOMMERCE/**_fronend_**" folder এ npm দিয়ে **react** app install করতে হবে 
####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/fronend]
""""""""""""""""""""""""""""""""""""""""""""""""""
npx create-react-app .
```
####


2. আবারো terminal দিয়ে "6PP_ECOMMERCE/**_fronend_**" folder এ npm দিয়ে **axios, react-alert, react-alert-template-basic, react-helmet, redux, react-redux, redux-thunk, redux-devtools-extension, react-router-dom, overlay-navbar, react-icons** dependencies গুলো install করতে হবে । এর পর app টাকে command এর সাহায্যে start করতে হবে

>
>> **_overlay-navbar_**  কে কাজ করতে হলে অবশ্যই অবশ্যই **_react-icons & react-router-dom_** install থাকা লাগবে 

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/fronend]
""""""""""""""""""""""""""""""""""""""""""""""""""
npm i axios react-alert react-alert-template-basic react-helmet redux react-redux redux-thunk redux-devtools-extension react-router-dom overlay-navbar react-icons

npm start
```
####


3. এবার react app টাকে clean করে নিতে হবে অর্থাৎ সব অপ্রয়োজনিয় files/folder delete করে দিতে হবে


### overlay-navbar : [04:46:00 - s65d4f5gf400]

4. এবার **react-router** এর website এর নিয়ম অনুযায়ী 6PP_ECOMMERCE/frontend/src/**_index.js & App.js_** file এর **_"App"_** component কে যথাক্রমে **_BrowserRouter & Routes,Route_** দিয়ে wrapping করে নিতে হবে
5. **_overlay-navbar_** এর কাজ শুরু করার জন্য 6PP_ECOMMERCE/**_fronend_** folder এর ভিতরে frontend/src/component/layout/Header/**_Header.js_** file বানাতে হবে
6. এবার **_Header.js_** file এ **_ReactNavbar_** কে import করে নিয়ে তার ভিতরে requrirments অনুযায়ী **_options_** props কে add করতে হবে

>
>> **_overlay-navbar_**  এর **_options_** props এর key-value গুলো **_overlay-navbar_** library থেকে নিতে হবে

####
```http
[[FOLDERNAME : 6PP_ECOMMERCE/frontend/src/component/layout/Header/Header.js]
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
import React from 'react';
import { ReactNavbar } from "overlay-navbar"

const Header = () => {
    return (
        <ReactNavbar />
    );
};

export default Header;
```
####






























## 10_Document Title

### KeyWord : [timestart - timeEnd]
>
>> _details details details details details details details details_
>
>> _details details details details details details details details_


1. steps steps steps steps steps steps steps steps steps steps steps steps steps steps steps 
####

```http
[[FOLDERNAME : 6PP_ECOMMERCE/backend/path/path.js]
""""""""""""""""""""""""""""""""""""""""""""""""""
npm i express mongoose dotenv cors
```
####




