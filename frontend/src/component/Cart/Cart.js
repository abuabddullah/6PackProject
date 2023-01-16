import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../reducers/productsReducer/cartSlice";
import PageTitle from "../layout/PageTitle/PageTitle";
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
    <PageTitle title={"Cart"} />
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
