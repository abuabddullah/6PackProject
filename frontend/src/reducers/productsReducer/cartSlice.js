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
