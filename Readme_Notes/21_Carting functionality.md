# Carting Items, LocalStorage

## cartSlice.js

```http
filepath: frontend\src\reducers\productsReducer\cartSlice.js
"""""""""""""""""""""""""""""""""""""""""""
/** here "state = initialState" reffering to the current-state of initialState and "action.payload = {product,quantity}" which is the clicked item from the UI
 * for cartItems: if localstorage has cartItems then parse it to JSON and assign it to cartItems, else assign empty array to cartItems
 * for cartTotalQuantity: if localstorage has cartItems then parse it to JSON and assign it to cartItems, else assign 0 to cartTotalQuantity
 * for cartTotalAmmount: if localstorage has cartItems then parse it to JSON and assign it to cartItems, else assign 0 to cartTotalAmmount
 *   */

/** steps for "addToCart" action-function
 * 1.a. destructuring the product and quantity from the action.payload
 * 1.b. find the clicked item in the cartItems array(if it exists)
 * 2. if it exists, then replace the cartQuantity of that item with quantity in the cartItems array
 * 3. if it doesn't exist, then add the item and item.cartQuantity by 1 and add the item to the cartItems array
 * 4. then increase the cartTotalAmmount by the price of the clicked item
 * 6. then increase the cartTotalQuantity by qty4Carting
 * 5. then we need to add the cartItems in the localStorage
 *   */

/** steps for "removeFromCart" action-function
 * 1. segregate the non-clicked items from the cartItems array
 * 2. set the replace the previous items array with the segregated items in the cartItems array
 * 3. then decrease the cartTotalAmmount by the price of the clicked item's total pirce
 * 4. then decrease the cartTotalQuantity by the clicked item's total quantity
 * 5. then we need to add the cartItems in the localStorage
 *   */

/* the increaseQuantity and decreaseQuantity will be managed by the addToCart function cause its recieving the required cart quantity from the UI */

import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  cartTotalQuantity: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems")).reduce(
        (previousValue, item) => previousValue + Number(item.cartQuantity),
        0 //initial value i.e acc=previousValue=0
      )
    : 0,
  cartTotalAmmount: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems")).reduce(
        (previousValue, item) =>
          previousValue + Number(item.cartQuantity) * Number(item.price),
        0 //initial value i.e acc=previousVa
      )
    : 0,
  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product: pd4Carting, quantity: qty4Carting } = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item._id === pd4Carting._id
      );
      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity = qty4Carting;
        toast.info(
          `"${state.cartItems[itemIndex].name}" cart Quantity : ${state.cartItems[itemIndex].cartQuantity}`,
          {
            position: "bottom-left",
            /* autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, */
          }
        );
      } else {
        const temptItem = { ...pd4Carting, cartQuantity: qty4Carting };
        state.cartItems.push(temptItem);
        toast.success(`${pd4Carting.name} added to cart`, {
          position: "bottom-left",
          /* autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, */
        });
      }
      state.cartTotalQuantity = state.cartItems.reduce(
        (previousValue, item) => previousValue + Number(item.cartQuantity),
        0 //initial value i.e acc=previousValue=0;
      );
      state.cartTotalAmmount = state.cartItems.reduce(
        (previousValue, item) => {
          return previousValue + Number(item.cartQuantity) * Number(item.price);
        },
        0 //initial value i.e acc=previousValue=0;
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      const restsItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      state.cartItems = restsItems;
      state.cartTotalQuantity -= action.payload.cartQuantity;
      state.cartTotalAmmount -=
        Number(action.payload.price) * Number(action.payload.cartQuantity);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmmount = 0;
      localStorage.removeItem("cartItems");
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
    saveOrderInfo: (state, action) => {
      state.orderInfo = action.payload;
      sessionStorage.setItem("orderInfo", JSON.stringify(state.orderInfo));
    },
  },
  extraReducers: {},
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  saveShippingInfo,
  saveOrderInfo,
} = cartSlice.actions;

export default cartSlice.reducer;



```

## store.js

```http
filepath: frontend\src\app\store.js
"""""""""""""""""""""""""""""""""""""""""""
import { configureStore } from "@reduxjs/toolkit";
import { products4HomeAPI } from "../reducers/productsReducer/products4HomeAPI";
import productsReducer from "./../reducers/productsReducer/productsSlice";
import userReducer from "./../reducers/productsReducer/userSlice";
import userProfileReducer from "./../reducers/productsReducer/profileSlice";
import productDetailsReducer from "./../reducers/productsReducer/singleProductSlice";
import cartReducer from "./../reducers/productsReducer/cartSlice";
const store = configureStore({
    reducer: {
        products: productsReducer,
        productDetails: productDetailsReducer,
        userDetails: userReducer,
        userProfile: userProfileReducer,
        cart: cartReducer,
        [products4HomeAPI.reducerPath]: products4HomeAPI.reducer, // x
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(products4HomeAPI.middleware), // x
})

export default store;
```

## cart.js & LoginSignUp.js

> বিশেষ দ্রষ্টব্য
>
> > আমরা যখন Phero এর project করেছিলাম তখন একটা সমস্যা face করতাম কিন্তু সমাধান জানতাম না আর তাহল যদি কোন protect-route এ unlogged in অবস্থায় click করতাম তাহলে আমাদেরকে login page নিলেও login শেষে আবার home page এ নিয়ে আসত কারন আমরা যেই page এ যেতে চেয়েছিলাম তার record হারিয়ে গিয়েছে। আর এই সমস্যাটাই solve করা সম্ভব হচ্ছে **_navigate("/login?redirect=/shipping")_** এরসাহায্যে
> >
> > > এখানে checkout এর জন্য click করা হলে যদি user logged in না থাকে তাহলে আমাদেরকে **_Login_** route এ নিয়ে যাবে আর **Login** route এর **_location.search_** এর value হিসেবে **_?redirect=/shipping_** কে ধরে রাখবে
> >
> > > এবার **_LoginSignUp_** আগে যেখানে যদি user logged in থাকে তাহলে **_"/account"_** page এ নেবার কথা ছিল সেখানে conditional routing করব **_redirectURL_** এর উপরে ।যদি **_location.search_** এর value হিসেবে **_?redirect=/shipping_** থাকে তাহলে login in এর পরে user কে সাথে সাথে **_/shipping_** page এ routing করব আর যদি কিছু না থাকে তাহলে তাকে **_"/account"_** page এ routing করব

```http
filepath: frontend\src\component\Cart\Cart.js
"""""""""""""""""""""""""""""""""""""""""""
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../reducers/productsReducer/cartSlice";
import CartItemCard from "./CartItemCard";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, cartTotalQuantity, cartTotalAmmount } = useSelector(
    (state) => state.cart
  );

  const decreaseQuantity = (product) => {
    const { cartQuantity } = product;
    const quantity = cartQuantity - 1;
    if (1 >= cartQuantity) {
      return;
    }
    dispatch(addToCart({ product, quantity }));
  };

  const increaseQuantity = (product) => {
    const { cartQuantity, Stock } = product;
    const quantity = cartQuantity + 1;
    if (Stock <= cartQuantity) {
      return;
    }
    dispatch(addToCart({ product, quantity }));
  };

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />

          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item._id}>
                  <CartItemCard item={item} />
                  <div className="cartInput">
                    <button onClick={() => decreaseQuantity(item)}>-</button>
                    <input type="number" value={item.cartQuantity} readOnly />
                    <button onClick={() => increaseQuantity(item)}>+</button>
                  </div>
                  <p className="cartSubtotal">{`$${
                    item.price * item.cartQuantity
                  }`}</p>
                </div>
              ))}

            <div className="cartGrossProfit">
              <div></div>
              <div className="cartGrossProfitBox">
                <p>Gross Total</p>
                <p>{`$${cartTotalAmmount}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button
                  onClick={() => navigate("/login?redirect=/shipping")} // this is used as alternative of ProtectedRouting system which is RequireAuth 10:35:46 - 10:38:20 এর মানে হচ্ছে যদি login করা থেকে তাহলে shipping page এ যাও নইলে login page এ যাও কিন্তু এটার আর ProtectedRouting system এর পার্থক্য হচ্ছে এখানে আমরা conditioning(login page এ) করে ২-৩ ধাপ পরে গিয়েও location এর record keep করে তদানুযায়ী একে redirect করাতে পারি।
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;







_________________________________________________
filepath: frontend\src\component\Cart\Cart.js
"""""""""""""""""""""""""""""""""""""""""""""""
import FaceIcon from "@mui/icons-material/Face";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loginUser,
  registerNewUser,
} from "../../reducers/productsReducer/userActions";
import { clearUserErrors } from "../../reducers/productsReducer/userSlice";
import Loader from "../layout/Loader/Loader";

const LoginSignUp = () => {
  const navigate = useNavigate();

  // for reducer related to login and register
  const dispatch = useDispatch();
  const { userInfo, error, loading, isAuthenticated } = useSelector(
    (state) => state.userDetails
  );

  // for login form
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // for register form
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = user;
  const [avatar, setAvatar] = useState("/Profile.png");
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  // conditional routing for payment based on user login or not
  const location = useLocation();
  const redirectingURL = location.search
    ? location.search.split("=")[1]
    : "/account";
  // api post handler
  useEffect(() => {
    if (error) {
      toast.error(error, { id: "loginUser_error" });
      dispatch(clearUserErrors());
    }
    if (isAuthenticated) {
      navigate(redirectingURL);
    }
  }, [dispatch, error, navigate, isAuthenticated, redirectingURL]);

  // for login form
  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: loginEmail, password: loginPassword }));
  };

  // for register form
  const registerSubmit = (e) => {
    e.preventDefault();
    const registerForm = new FormData();

    registerForm.set("name", name);
    registerForm.set("email", email);
    registerForm.set("password", password);
    registerForm.set("avatar", avatar);
    dispatch(registerNewUser(registerForm));
  };

  /** for uploading image preview
   * step 1: create a reader
   * step 2: create a function to read the file during "onload"
   * step 3: if file-loading done set the reader to read the file (like for preview)
   *      onload has 3 readyState:= 0: not started / initial, 1: loading, 2: done
   * step 4: set the reader to read the file as a data url
   */
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginSignUp;


```

## CartItemCard.js

```http
filepath: frontend\src\component\Cart\CartItemCard.js
"""""""""""""""""""""""""""""""""""""""""""
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromCart } from "../../reducers/productsReducer/cartSlice";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <div className="CartItemCard">
      <img src={item.images[0].url} alt="ssa" />
      <div>
        <Link to={`/product/${item._id}`}>{item.name}</Link>
        <span>{`Price: $${item.price}`}</span>
        <p onClick={() => dispatch(removeFromCart(item))}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;

```
