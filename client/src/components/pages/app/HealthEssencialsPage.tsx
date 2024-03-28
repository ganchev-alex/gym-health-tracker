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
import {
  setExplorePreviewVisibility,
  setHeadersState,
} from "../../../features/styles-manager-actions";

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
    dispatch(
      setHeadersState({
        mainHeader: "Health Essentials",
        subHeader: "Personalized health tracking made simple.",
      })
    );
    dispatch(setExplorePreviewVisibility(false));
  }, []);

  useEffect(() => {
    if (!loadedState) {
      loadEssentialsData();

      dispatch(calculateActiveTime());
      dispatch(calculateBurntCalories());
    }
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
