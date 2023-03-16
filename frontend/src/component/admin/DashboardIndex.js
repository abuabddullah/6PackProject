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
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
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
      <div>
        <h1>Dashboard</h1>
        <div className="amountIndicator">
          <h4>Total Ammount</h4>
          <h2>${5000}</h2>
        </div>
        <div className="statCircle">
          <div className="product">
            <p>Product</p>
            <p>"{12}"</p>
          </div>
          <div className="orders">
            <p>Orders</p>
            <p>"{12}"</p>
          </div>
          <div className="users">
            <p>Users</p>
            <p>"{12}"</p>
          </div>
        </div>
      </div>
      <div className="statChart">
        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;
