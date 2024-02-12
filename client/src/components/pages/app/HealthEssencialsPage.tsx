import React, { useEffect } from "react";

import styles from "./HealthEssencialsPage.module.css";

import WaterWidget from "../../essencials_page/water_widget/WaterWidget";
import CaloriesIntakeWidget from "../../essencials_page/calories_intake_widget/CaloriesIntakeWidget";
import SleepWidget from "../../essencials_page/sleep_widget/SleepWidget";
import ActivitiesWidget from "../../essencials_page/activities_widget/ActivitiesWidget";
import SummaryWidget from "../../essencials_page/summary_widget/SummaryWidget";
import TimespanControlls from "../../essencials_page/timespan_controlls/TimespanControlls";
import { getToken } from "../../../util/auth";
import { mainAPIPath } from "../../../App";
import { useDispatch, useSelector } from "react-redux";
import {
  Essentials,
  calculateActiveTime,
  calculateBurntCalories,
  setLoadedEssentialsData,
  setTargets,
} from "../../../features/health-essentials-actions";
import { RootState } from "../../../features/store";
import { setNotificationState } from "../../../features/workout-page-actions";

function HealthEssencialsPage() {
  const dispatch = useDispatch();

  const preferences = useSelector(
    (state: RootState) => state.userActions.loadedUserData.preferences
  );

  const loadedState = useSelector(
    (state: RootState) => state.healthEssentials.loaded
  );

  const loadEssentialsData = async function () {
    try {
      const response = await fetch(`${mainAPIPath}/ess/essentials-data`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.ok) {
        const data: {
          essentialsToday: Essentials;
          essentialsYesterday: Essentials;
        } = await response.json();

        dispatch(
          setLoadedEssentialsData({
            todayEss: data.essentialsToday,
            yesterdayEss: data.essentialsYesterday,
          })
        );
      }
    } catch (error) {
      dispatch(
        setNotificationState({
          message: "😨 Couldn't load essentials data.",
          visibility: true,
        })
      );
      setTimeout(() => {
        dispatch(setNotificationState({ visibility: false }));
      }, 4000);
    }
  };

  useEffect(() => {
    if (!loadedState) {
      loadEssentialsData();
    }

    let activityTimeTarget;
    switch (preferences.fitnessGoal) {
      case "Muscle & Weigth Gain":
      case "Muscle & Weigth Lost":
      case "Tone and Define Muscles":
        activityTimeTarget = 5400;
        break;
      case "Improved Cardiovascular Health":
      case "Maintain Current Fitness Level":
      default:
        activityTimeTarget = 3600;
        break;
      case "Increased Flexibility":
      case "Improve Overall Health":
        activityTimeTarget = 2700;
        break;
      case "Stress Relief and Relaxation":
      case "Enhance Mental Well-being":
        activityTimeTarget = 1800;
    }

    const burntCaloriesTarget =
      preferences.fitnessGoal === "Muscle & Weigth Lost" ? 750 : 300;

    const sleepTarget =
      preferences.frequencyStatus === "5-6 times a week" ||
      preferences.frequencyStatus === "Daily"
        ? 9
        : 7.5;

    const waterTarget =
      preferences.frequencyStatus === "5-6 times a week" ||
      preferences.frequencyStatus === "Daily"
        ? 2500
        : 2000;

    dispatch(
      setTargets({
        activityTimeTarget,
        burntCaloriesTarget,
        sleepTarget,
        waterTarget,
      })
    );

    // Dispatching active time and calories data
    dispatch(calculateActiveTime());
    dispatch(calculateBurntCalories());
  }, []);

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
        <WaterWidget />
        <SummaryWidget />
      </div>
    </div>
  );
}

export default HealthEssencialsPage;
