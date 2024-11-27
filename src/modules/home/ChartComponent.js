import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartComponent = ({ expense, income }) => {
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverBackgroundColor: ["#66BB6A", "#FF6E6E"],
      },
    ],
  };

  return (
    <div style={{ width: "100%", maxWidth: "300px", margin: "20px auto" }}>
      <Doughnut data={data} />
    </div>
  );
};

export default ChartComponent;
