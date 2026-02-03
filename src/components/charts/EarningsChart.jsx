import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function EarningsChart({ data }) {
  const chartData = {
    labels: data.map((d) => d.day),
    datasets: [
      {
        label: "Total Collection",
        data: data.map((d) => d.total),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
      },
      {
        label: "Fees Collection",
        data: data.map((d) => d.fees),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.2)",
        tension: 0.4,
      },
    ],
  };

  return <Line data={chartData} />;
}