import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AttendanceChart({ present, absent }) {
  const data = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, absent],
      },
    ],
  };

  return <Pie data={data} />;
}   