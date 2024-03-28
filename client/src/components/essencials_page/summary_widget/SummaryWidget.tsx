import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import styles from "./SummaryWidget.module.css";

import center from "../../../assets/images/heartbeat.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryWidget = function () {
  const { activityTime, burntCalories, water } = useSelector(
    (state: RootState) =>
      state.healthEssentials.isToday
        ? state.healthEssentials.today
        : state.healthEssentials.yesterday
  );
  const { activityTimeTarget, burntCaloriesTarget, waterTarget } = useSelector(
    (state: RootState) => {
      return state.healthEssentials.targets;
    }
  );

  const activeTimeData = {
    data: {
      labels: ["👟 Active Time", "🗻 Optimal Target"],
      datasets: [
        {
          data: [
            activityTime,
            activityTimeTarget - activityTime > 0
              ? activityTimeTarget - activityTime
              : 0,
          ],
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
          data: [water, waterTarget - water > 0 ? waterTarget - water : 0],
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
          data: [
            burntCalories,
            burntCaloriesTarget - burntCalories > 0
              ? burntCaloriesTarget - burntCalories
              : 0,
          ],
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
      <div className={styles["hover-prevent"]}>
        <img src={center} />
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
    </main>
  );
};

export default SummaryWidget;
