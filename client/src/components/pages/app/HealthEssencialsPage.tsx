import React from "react";

import styles from "./HealthEssencialsPage.module.css";

import WaterWidget from "../../essencials_page/water_widget/WaterWidget";
import CaloriesIntakeWidget from "../../essencials_page/calories_intake_widget/CaloriesIntakeWidget";
import SleepWidget from "../../essencials_page/sleep_widget/SleepWidget";
import ActivitiesWidget from "../../essencials_page/activities_widget/ActivitiesWidget";
import SummaryWidget from "../../essencials_page/summary_widget/SummaryWidget";
import TimespanControlls from "../../essencials_page/timespan_controlls/TimespanControlls";

function HealthEssencialsPage() {
  return (
    <div className={styles["content-wrapper"]}>
      <div className={styles["left"]}>
        <TimespanControlls />
        <ActivitiesWidget />
      </div>
      <div className={styles["middle"]}>
        <CaloriesIntakeWidget />
        <SleepWidget />
      </div>
      <div className={styles["rigth"]}>
        <SummaryWidget />
        <WaterWidget />
      </div>
    </div>
  );
}

export default HealthEssencialsPage;
