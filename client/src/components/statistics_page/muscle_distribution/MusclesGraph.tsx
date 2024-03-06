import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartConfiguration,
} from "chart.js";
import { Radar } from "react-chartjs-2";

import styles from "./MusclesGraph.module.css";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const MusclesGraph = function () {
  const radarConfig = {
    data: {
      labels: ["Back", "Chest", "Core", "Shoulders", "Arms", "Legs"],
      datasets: [
        {
          label: "This Week",
          data: [20, 90, 30, 50, 20, 30],
          backgroundColor: "hsla(352, 75%, 60%, 0.5)",
          borderColor: "#e54c60",
          borderWidth: 2,
        },
        {
          label: "Previous Week",
          data: [80, 30, 20, 10, 80, 90],
          backgroundColor: "rgba(130, 130, 130, 0.5)",
          borderColor: "#828282",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 100,
            stepSize: 20,
            font: {
              size: 14,
            },
          },
          pointLabels: {
            font: {
              size: 16,
            },
          },
        },
      },
      scale: {
        gridLines: {
          color: "#828282",
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
            },
          },
        },
      },
    },
  };

  return (
    <div className={styles["graph-container"]}>
      <Radar data={radarConfig.data} options={radarConfig.options} />
    </div>
  );
};

export default MusclesGraph;
