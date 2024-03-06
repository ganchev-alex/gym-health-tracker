import styles from "./EssentialsSummary.module.css";

import running from "../../../assets/images/activity.png";
import burntCalories from "../../../assets/images/calories.png";
import sleepTime from "../../../assets/images/sleep.png";
import hydration from "../../../assets/images/water_drop.png";
import caloriesIntake from "../../../assets/images/calories_intake.png";
import React from "react";

const EssentialsSummary = function () {
  const widgetsData = [
    {
      className: "active-time",
      image: running,
      label: "Avg. Active Time: 00:00 / 01:00",
    },
    {
      className: "burnt-calories",
      image: burntCalories,
      label: "Avg. Burnt Calories: 0 / 300",
    },
    {
      className: "sleep-time",
      image: sleepTime,
      label: "Avg. Sleep Time: 0 / 9",
    },
    {
      className: "hydration",
      image: hydration,
      label: "Avg. Water Intake: 0 / 2500",
    },
    {
      className: "calories-intake",
      image: caloriesIntake,
      label: "Avg. Calories Intake: 0 / 2900",
    },
  ];

  return (
    <React.Fragment>
      <header className={styles.header}>
        <h6>
          Essentials Overview: <span>Weekly</span>
        </h6>
        <button>?</button>
      </header>
      <div className={styles.slider}>
        {widgetsData.map((widgetData) => (
          <div className={styles[widgetData.className]}>
            <span>
              <img src={widgetData.image} />
            </span>
            <p>{widgetData.label}</p>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default EssentialsSummary;
