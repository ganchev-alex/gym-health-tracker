import styles from "./EssentialsSummary.module.css";

import running from "../../../assets/images/activity.png";
import burntCalories from "../../../assets/images/calories.png";
import sleepTime from "../../../assets/images/sleep.png";
import hydration from "../../../assets/images/water_drop.png";
import caloriesIntake from "../../../assets/images/calories_intake.png";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEssentialPreviewModalState,
  setHelpModalState,
} from "../../../features/modals";
import { handleHorizontalScroll } from "../../../util/horizontalScroll";
import { RootState } from "../../../features/store";
import { secondsConverter } from "../../essencials_page/activities_widget/ActivitiesWidget";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import { setEssentailGraph } from "../../../features/statistics-actions";
import { setLoadingState } from "../../../features/loading-actions";

const EssentialsSummary = function () {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { essentialsStats, timeSpan } = useSelector(
    (state: RootState) => state.statsData
  );
  const { targets } = useSelector((state: RootState) => state.healthEssentials);

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const widgetsData = [
    {
      dataRef: "active-time",
      metrix: "Hours",
      className: "active-time",
      color: "#28cfc6",
      image: running,
      label: `Avg. Active Time: ${secondsConverter(
        essentialsStats.activeTime
      )} / ${secondsConverter(targets.activityTimeTarget)} h.`,
    },
    {
      dataRef: "burnt-calories",
      metrix: "Cal",
      className: "burnt-calories",
      color: "#4858e7",
      image: burntCalories,
      label: `Avg. Burnt Calories: ${Math.floor(
        essentialsStats.burntCalories
      )} / ${targets.burntCaloriesTarget} cl.`,
    },
    {
      dataRef: "sleep-time",
      metrix: "Hours",
      className: "sleep-time",
      color: "#a06ae4",
      image: sleepTime,
      label: `Avg. Sleep Time: ${Math.floor(essentialsStats.sleepTime)} / ${
        targets.sleepTarget
      } h.`,
    },
    {
      dataRef: "hydration",
      metrix: "Mill",
      className: "hydration",
      color: "#5db9ed",
      image: hydration,
      label: `Avg. Water Intake: ${Math.floor(essentialsStats.waterIntake)} / ${
        targets.waterTarget
      } ml.`,
    },
    {
      dataRef: "consumed-calories",
      metrix: "Cal",
      className: "calories-intake",
      color: "#ed9c3f",
      image: caloriesIntake,
      label: `Avg. Calories Intake: ${Math.floor(
        essentialsStats.caloriesIntake
      )} / ${targets.caloriesIntake}`,
    },
  ];

  const onOpenSummaryPreview = async function (index: number) {
    dispatch(setLoadingState(true));
    dispatch(
      setEssentialPreviewModalState({
        visibility: true,
        essenstial: widgetsData[index].dataRef
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        metrix: widgetsData[index].metrix,
        color: widgetsData[index].color,
      })
    );
    try {
      const response = await fetch(
        `${mainAPIPath}/stats/essential?essential=${widgetsData[index].dataRef}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.ok) {
        const data: { statsData: { date: string; value: number }[] } =
          await response.json();
        console.log(data.statsData);
        dispatch(setEssentailGraph(data.statsData));
      } else {
        dispatch(setEssentailGraph([]));
      }
    } catch {
      dispatch(setEssentailGraph([]));
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  return (
    <React.Fragment>
      <header className={styles.header}>
        <h6>
          Essentials Overview:{" "}
          <span style={isMale ? { color: "#472ed8" } : undefined}>
            {timeSpan[0].toUpperCase() + timeSpan.slice(1) + "ly"}
          </span>
        </h6>
        <button
          onClick={() =>
            dispatch(
              setHelpModalState({
                visibility: true,
                tip: "The health essentials section gives you an average based on your tracking and currantly selected period of time. By clicking on each essential you will be presented to a detailed graph of your performance through out the past 30 days.",
              })
            )
          }
        >
          ?
        </button>
      </header>
      <div
        className={styles.slider}
        ref={scrollRef}
        onWheel={(event) => {
          handleHorizontalScroll(event, scrollRef);
        }}
      >
        {widgetsData.map((widgetData, index) => (
          <div
            key={index}
            className={styles[widgetData.className]}
            onClick={() => onOpenSummaryPreview(index)}
          >
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
