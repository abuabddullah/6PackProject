import { Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { saveOrderInfo } from "../../reducers/productsReducer/cartSlice";
import PageTitle from "../layout/PageTitle/PageTitle";
import CheckoutSteps from "./CheckoutSteps";

const ConfirmOrder = () => {
  // import all redux related stuff
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, cartTotalQuantity, cartTotalAmmount, shippingInfo } =
    useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userDetails);

  // generate order summary related stuff
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}, ${shippingInfo.pinCode}`;
  const shippingCharges = cartTotalAmmount > 1000 ? 0 : 200;
  const taxPercentage = 15; // 15%
  const totalTax = (cartTotalAmmount * taxPercentage) / 100;
  const totalPrice = cartTotalAmmount + totalTax + shippingCharges;

  const handleProceedToPayment = () => {
    const orderDetails = {
      cartTotalAmmount,
      shippingCharges,
      totalTax,
      totalPrice,
    };
    dispatch(saveOrderInfo(orderDetails)); // just to save orderInfo in session storage via redux

    navigate("/process/payment");
  };

  return (
    <>
      <PageTitle title={"ConfirmOrder"} />
      <CheckoutSteps activeStep={1} />

      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{userInfo.name}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item._id}>
                    <img src={item.images[0].url} alt="Product" />
                    <Link to={`/product/${item._id}`}>{item.name}</Link>{" "}
                    <span>
                      {item.cartQuantity} X ${item.price} ={" "}
                      <b>${item.price * item.cartQuantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*  */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summery</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>${cartTotalAmmount}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>${shippingCharges}</span>
              </div>
              <div>
                <p>GST: ({taxPercentage}% Vat)</p>
                <span>${totalTax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>${totalPrice}</span>
            </div>

            <button onClick={handleProceedToPayment}>Proceed To Payment</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
