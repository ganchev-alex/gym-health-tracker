import styles from "./SleepWidget.module.css";

import sleep from "../../../assets/images/sleep.png";
import { Doughnut } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SleepWidget = function () {
  const doughnut = {
    data: {
      labels: ["💤 Sleep Time", "🌙 Optimal"],
      datasets: [
        {
          data: [8, 1],
          backgroundColor: ["#A06AE4", "#DAC5F4"],
          hoverBackgroundColor: ["#A06AE4", "#DAC5F4"],
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "80%",
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <span className={styles["icon-slot"]}>
          <img alt="Calories Intake" src={sleep} />
        </span>
        <h5>Sleeping Time</h5>
      </div>
      <main className={styles.statistics}>
        <div>
          <Doughnut data={doughnut.data} options={doughnut.options} />
        </div>
        <p>
          Total: <br /> <span>8 hours</span>
        </p>
      </main>
      <div className={styles.controll}>
        <span>
          <label htmlFor="bed">Bed Time: </label>
          <input id="bed" name="bed" type="time" />
        </span>
        <span>
          <label htmlFor="wake">Wake up Time: </label>
          <input id="wake" name="wake" type="time" />
        </span>
      </div>
    </div>
  );
};

export default SleepWidget;
