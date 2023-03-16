# ordering and handleing

## Backend

### orderModel.js

> > আমরা যখন backend এ **orderModel** বানিয়েছিলাম তখন OrderSchema.OrderItems.[0].**_quantity, \_product, imgage{}_** ছিল যা এখন **_cartQuantity, \_id, imgages[{for public_id},{for url},{for _id}]_** করে দিতে হবে

```http
filepath: backend\models\orderModel.js
"""""""""""""""""""""""""""""""""""""""
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: Number, required: true },
    phoneNo: { type: Number, required: true },
  },
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      cartQuantity: { type: Number, required: true },
      images: [
        {
          public_id: { type: String, required: true },
          url: { type: String, required: true },
          _id: { type: String, required: true },
        },
      ],
      _id: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  paidAt: { type: Date, required: true },
  itemsPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  orderStatus: { type: String, required: true, default: "Processing" },
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;


```

### orderController.js

> > **orderController.js** file এর **_myAllOrders_** কে **createAsyncErrorMiddleware** দিয়ে wrap করে ্দিলে কিংবা **try-catch** block use করলে কোন কাজ করে না তাই একে আপাতত চেঞ্জ করে directe করে দিছি নিচের মত্ন

```http
filepath: backend\controllers\orderController.js
"""""""""""""""""""""""""""""""""


// get logged in user  Orders
exports.myAllOrders = async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
};

_____________________
previous
"""""""""""""""""""""""""""""""""
exports.myAllOrders = catchAsyncErrorsMiddleware(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});
```

## frontend

### MyOrders.js

- install <a href="https://www.npmjs.com/package/@material-ui/data-grid"><b>npm i @material-ui/data-grid</b></a>

> > **DataGrid** MUI এর special table যা **filter,sort,pagination** সহ আরো অনেক features দিইয়ে আমাদের table কে strong করে তুলে
> >
> > > **DataGrid** বেশ কিছু default attribute recievd করে,
> > >
> > > > **columns** প্রতি columns তে কিদেখাব
> > >
> > > > **rows** প্রতি row তে কিদেখাব
> > >
> > > > **pageSize** প্রতি page এ কটা করে row(item) দেখাব
> > >
> > > > **disableSelectionOnClick** row selcetion off করে দিবে
> > >
> > > > **className** for styling
> > >
> > > > **autoHeight** height auto করে দিবে
> > >
> > > **DataGrid** এর default attribute **column & row** এর বিশ্লেষন,
> > >
> > > > **columns[]** কিছু **object{}** recieved করে,
> > > >
> > > > > এই **object{}** গুলোকে যদি **inputTag** এর সাথে তুলনা করি তাহলে,
> > > > >
> > > > > > এর **field** হচ্ছে **inputTag** এর **name** attr এর মত যার সাহায্যে **inputTag** কে target করে code করা যায়
> > > > >
> > > > > > এর **headerName** হচ্ছে **inputTag** এর **value** attr এর মত যা ই মূলত UI তে লিখা হিসেবে show করবে
> > > > >
> > > > > > এর **minWidth** হচ্ছে minimum withd in pixel
> > > > >
> > > > > > এর **flex** হচ্ছে display-flex এর মতন
> > > > >
> > > > > > এর **cellClassName** হচ্ছে একটা special key যার সাহায্যে আমরা চাইলে কোন css-class name **value** হিসেবেও দিতে পারি আবার চাইলে conditional-css এর জন্য function কেও assign করতে পারি.
> > > > > >
> > > > > > > যদি function দেই তাহলে তা একটা **params** নেয় যার ভিতরে একটা **getValue** method থাকে যার সাহায্যে আমরা চাইলে কোন specific column কে target করতে পারি। সূত্র হচ্ছে,
> > > > > > >
> > > > > > > > **_params.getValue(params.id, "status")_**
> > > > > > > >
> > > > > > > > > **params.id** মানে সেই column এর **field** কে বুঝানো হচ্ছে
> > > > > > > >
> > > > > > > > > **status** মানে সেই column এর status
> > >
> > > > **row[]** ও কিছু **object{}** recieved করে তবে এই object গুলোর **key** হচ্ছে **colum[]** এ define করা প্রতিটা **object{}** এর সমানুপাতিক। আরো সহজে যদি বলি,
> > > >
> > > > > **colum[]** এ যতটা **object{}** define করা আছে কেবল ততটা এবং সেই সব **object{}** এর **_colum[n].field_** name এর হুবহু অনুরূপ হতেই হবে নইলে error আসতে পারে
> > > >
> > > > তাই এখানে **orders** state কে **foreach** করে **row[]** কে define করা হয়েছে

```http
filepath: frontend\src\component\order\MyOrders.js
"""""""""""""""""""""""""""""""""""""""
import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { myOrders } from "../../reducers/productsReducer/orderActions";
import Loader from "../layout/Loader/Loader";
import PageTitle from "../layout/PageTitle/PageTitle";
import { Link } from "react-router-dom";
import LaunchIcon from '@mui/icons-material/Launch';
import { clearOrderErrors } from "../../reducers/productsReducer/orderSlice";
import { toast } from "react-toastify";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.userDetails);


  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 300,
      flex: 1
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];

  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id, // here _id is the order's id
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {
    if (error) {
        toast.error("myOrdering failed", { id: "myOrdering_err" });
      dispatch(clearOrderErrors());
    }

    dispatch(myOrders());
  }, [dispatch, error]);

  return (
    <>
      <PageTitle title={`${userInfo.name}'s Orders`} />
      {loading ? (
        <Loader />
      ) : (
        <div className="myOrdersPage">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10} // number of rows per page
            disableSelectionOnClick // disable row selection
            className="myOrdersTable"
            autoHeight // auto height of table based on rows
          />

          <Typography id="myOrdersHeading">{userInfo.name}'s Orders</Typography>
        </div>
      )}
    </>
  );
};

export default MyOrders;


```
