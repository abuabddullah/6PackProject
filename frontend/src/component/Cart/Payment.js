import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Typography } from "@mui/material";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { process4Payment } from "../../reducers/productsReducer/paymentActions";
import PageTitle from "../layout/PageTitle/PageTitle";
import CheckoutSteps from "./CheckoutSteps";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payBtn = useRef(null);
  const stripe = useStripe(); // from stripe
  const elements = useElements(); // from stripe

  // getting orderInfo,shippingInfo,cartItems,userInfo via redux and sessionStorage
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { cartItems, cartTotalQuantity, cartTotalAmmount, shippingInfo } =
    useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userDetails);
  const { client_secret } = useSelector((state) => state.payment);

  // objectify actualPayment actualOrder for backend
  const actualPaymentAmmountInSent = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };
  const actualOrderInBrief = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.cartTotalAmmount,
    taxPrice: orderInfo.totalTax,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  useEffect(() => {
    dispatch(process4Payment(actualPaymentAmmountInSent)); // এই dispathching(success হবার) এর কারনেই redux এর state এ client_secret আসবে
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true; // payment button এ click করার সাথে সাথেই disabled করে দিচ্ছি

    // মূল্যটাকে backend এ পাঠাইয়ে payment process করার জন্য যাতে client_secret পাওয়া যায়
    try {
      /* dispatch(process4Payment(actualPaymentAmmountInSent)); // এই dispathching(success হবার) এর কারনেই redux এর state এ client_secret আসবে */

      if (!stripe || !elements) return; // যদি stripe এর কোন কিছু না থাকে তাহলে ফাংশনটি বাদ দিচ্ছি

      // backend থেকে আসা client_secret পেয়ে গেছি redux-state এ এখন stripe এর website এর সাথে fixed-code-functionality করব
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: userInfo.name,
            email: userInfo.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false; // কোন কারনে যদি payment process করা যায় না তাহলে পুনরায় payment button clickable করে দিচ্ছি
        toast.error(result.error.message, { id: "stripeWebsite_error" });
      } else {
        if (result.paymentIntent.status === "succeeded") {
          actualOrderInBrief.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          toast.success(`success:${result.paymentIntent.status}`, {
            id: "stripeWebsite_success",
          });
          //   dispatch(createOrder(actualOrderInBrief));
          //   navigate("/success");
        } else {
          toast.error("There's some issue while processing payment ");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false; // কোন কারনে যদি payment process করা যায় না তাহলে পুনরায় payment button clickable করে দিচ্ছি
      toast.error(error?.response?.data?.message, {
        id: "process4Payment_error",
      });
    }
  };
  return (
    <>
      <PageTitle title={"Payment"} />
      <CheckoutSteps activeStep={2} />

      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>

          <input
            type="submit"
            value={`Pay - $${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </>
  );
};

export default Payment;
