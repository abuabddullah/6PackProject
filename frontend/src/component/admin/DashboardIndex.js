import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import React, { useEffect } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminAllOrders } from "../../reducers/productsReducer/orderActions";
import { fetchAdminProducts } from "../../reducers/productsReducer/productsActions";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardIndex = () => {
  const dispatch = useDispatch();
  const {products}=useSelector(state=>state.products)
  const {orders}=useSelector(state=>state.order)

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAdminAllOrders());
  }, [dispatch]);

  /* chartjs-react-chartjs */
  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        // data: [0, totalAmount],
        data: [0, 4000],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        // data: [outOfStock, products.length - outOfStock],
        data: [2, 10],
      },
    ],
  };

  return (
    <div className="dashboardIndex">
      <div className="dashboardSummary">
        <div>
          <p>
            Total Amount <br /> ${"20000"}
          </p>
        </div>
        <div className="dashboardSummaryBox2">
          <Link to="/admin/dashboard/products">
            <p>Product</p>
            {/* <p>{products && products.length}</p> */}
            <p>{"125"}</p>
          </Link>
          <Link to="/admin/dashboard/orders">
            <p>Orders</p>
            {/* <p>{orders && orders.length}</p> */}
            <p>{"125"}</p>
          </Link>
          <Link to="/admin/dashboard/users">
            <p>Users</p>
            {/* <p>{users && users.length}</p> */}
            <p>{"125"}</p>
          </Link>
        </div>
      </div>
      <div className="lineChart">
        <Line data={lineState} />
      </div>

      <div className="doughnutChart">
        <Doughnut data={doughnutState} />
      </div>
    </div>
  );
};

export default DashboardIndex;
