import styles from "./SleepWidget.module.css";

import sleep from "../../../assets/images/sleep.png";
import { Doughnut } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import {
  setBedTime,
  setSleepData,
  setWakeTime,
} from "../../../features/health-essentials-actions";

ChartJS.register(ArcElement, Tooltip, Legend);

const SleepWidget = function () {
  const dispatch = useDispatch();
  const { wakeTime, bedTime, sleepTime } = useSelector((state: RootState) => {
    return state.healthEssentials.isToday
      ? state.healthEssentials.today
      : state.healthEssentials.yesterday;
  });

  const [displaySleepTime, setDisplaySleepTime] = useState("Not recorderd");

  const suggestedSleepingTime = useSelector((state: RootState) => {
    return state.healthEssentials.targets.sleepTarget;
  });

  const doughnut = {
    data: {
      labels: ["💤 Sleep Time", "🌙 Optimal"],
      datasets: [
        {
          data: [
            sleepTime,
            suggestedSleepingTime - sleepTime > 0
              ? suggestedSleepingTime - sleepTime
              : 0,
          ],
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

  useEffect(() => {
    const { hours, minutes, displayMessage } = calculateSleepTime();
    dispatch(
      setSleepData({ bedTime, wakeTime, sleepTime: hours + minutes / 60 })
    );
    setDisplaySleepTime(displayMessage);
  }, [wakeTime, bedTime, sleepTime, setDisplaySleepTime]);

  const calculateSleepTime = () => {
    if (bedTime && wakeTime) {
      const bedTimeDate = new Date(`2000-01-01T${bedTime}`).getTime();
      const wakeTimeDate = new Date(`2000-01-01T${wakeTime}`).getTime();

      let timeDifference = wakeTimeDate - bedTimeDate;

      if (timeDifference < 0) {
        timeDifference += 24 * 60 * 60 * 1000;
      }

      const hours = Math.floor(timeDifference / (60 * 60 * 1000));
      const minutes = Math.floor(
        (timeDifference % (60 * 60 * 1000)) / (60 * 1000)
      );

      return {
        displayMessage: `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")} hours`,
        hours,
        minutes,
      };
    }

    return { displayMessage: "Not recorded", hours: 0, minutes: 0 };
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
          Total: <br /> <span>{displaySleepTime}</span>
        </p>
      </main>
      <div className={styles.controll}>
        <span>
          <label htmlFor="bed">Bed Time: </label>
          <input
            id="bed"
            name="bed"
            type="time"
            max="23:59"
            value={bedTime}
            onChange={(event) => {
              dispatch(setBedTime(event.target.value));
            }}
            required
          />
        </span>
        <span>
          <label htmlFor="wake">Wake up Time: </label>
          <input
            id="wake"
            name="wake"
            type="time"
            min="00:00"
            required
            value={wakeTime}
            onChange={(event) => {
              dispatch(setWakeTime(event.target.value));
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default SleepWidget;
