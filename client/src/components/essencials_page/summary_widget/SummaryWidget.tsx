import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import styles from "./SummaryWidget.module.css";

import center from "../../../assets/images/heartbeat.png";

ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryWidget = function () {
  const activeTimeData = {
    data: {
      labels: ["👟 Active Time", "🗻 Optimal Target"],
      datasets: [
        {
          data: [1.5, 0.5], // actual time, target - actual time
          backgroundColor: ["#28CFC6", "#F1FCFC"],
        },
      ],
    },
    options: {
      repsonsive: true,
      cutout: "88%",
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  const hydrationData = {
    data: {
      labels: ["💧 Hydaration", "💦 Optimal Target"],
      datasets: [
        {
          data: [1.2, 0.8], // actual data, target (depending on the progile and the active time) - actual hydration
          backgroundColor: ["#7DC6F0", "#F3FAFE"],
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "88%",
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  const burntCaloriesData = {
    data: {
      labels: ["🔥 Burnt Calories", "🧯 Optimal Target"],
      datasets: [
        {
          data: [300, 100], // actual data, target (depending on the user preference) - actaul data
          backgroundColor: ["#4858E7", "#F5F6FE"],
        },
      ],
      options: {
        responsive: true,
        cutout: "88%",
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    },
  };

  return (
    <main className={styles.widget}>
      <div className={styles["hover-prevent"]} />
      <div className={styles.legend}>
        <span>
          <div />
          Active 👟
        </span>
        <span>
          <div />
          Hydration 💦
        </span>
        <span>
          <div />
          Burnt Calories🔥
        </span>
      </div>
      <div className={styles.active}>
        <Doughnut data={activeTimeData.data} options={activeTimeData.options} />
      </div>
      <div className={styles.hydration}>
        <Doughnut data={hydrationData.data} options={hydrationData.options} />
      </div>
      <div className={styles.calories}>
        <Doughnut
          data={burntCaloriesData.data}
          options={hydrationData.options}
        />
      </div>
      <img src={center} />
    </main>
  );
};

export default SummaryWidget;
