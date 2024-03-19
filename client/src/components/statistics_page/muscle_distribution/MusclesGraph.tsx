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
import TotalWorkouts from "./TotalWorkouts";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import React from "react";
import LoadingPlane from "../../UI/LoadingPlane/LoadingPlane";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type PercentageDistribution<T> = {
  [K in keyof T]: number;
};

const MusclesGraph = function () {
  const { muscleDistribution, timeSpan } = useSelector(
    (state: RootState) => state.statsData
  );
  const { isLoading } = useSelector((state: RootState) => state.loadingManager);
  const { isMale } = useSelector((state: RootState) => state.userActions);

  function calculatePercentageDistribution<T>(
    distribution: T,
    total: number
  ): PercentageDistribution<T> {
    const result: PercentageDistribution<T> = {} as PercentageDistribution<T>;
    for (const key in distribution) {
      if (key !== "totalDistribution") {
        result[key as keyof T] = Math.floor(
          (+distribution[key as keyof T] / total) * 100
        );
      }
    }
    return result;
  }

  function generateDataSet<T>(
    distribution: PercentageDistribution<T>
  ): number[] {
    const dataSet: number[] = [];
    for (const key in distribution) {
      dataSet.push(distribution[key as keyof T]);
    }
    return dataSet;
  }

  const currantDistribution = calculatePercentageDistribution(
    muscleDistribution.currant,
    muscleDistribution.totalCurrant
  );
  const currantDataSet = generateDataSet(currantDistribution);

  const previousDistribution = calculatePercentageDistribution(
    muscleDistribution.previous,
    muscleDistribution.totalPrevious
  );
  const previousDataSet = generateDataSet(previousDistribution);

  const radarConfig = {
    data: {
      labels: ["Back", "Chest", "Core", "Shoulders", "Arms", "Legs"],
      datasets: [
        {
          label: "This " + timeSpan[0].toUpperCase() + timeSpan.slice(1),
          data: currantDataSet,
          backgroundColor: isMale
            ? "rgba(71, 46, 216, 0.6)"
            : "rgba(229, 76, 76, 0.5)",
          borderColor: isMale ? "#472ed8" : "#e54c60",
          borderWidth: 2,
        },
        {
          label: "Previous " + timeSpan[0].toUpperCase() + timeSpan.slice(1),
          data: previousDataSet,
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
            stepSize: 10,
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
    <div className={styles.widget}>
      <h3>Muscle Distribution</h3>
      {isLoading ? (
        <LoadingPlane />
      ) : (
        <React.Fragment>
          <div className={styles["graph-container"]}>
            <Radar data={radarConfig.data} options={radarConfig.options} />
          </div>
          <TotalWorkouts />
        </React.Fragment>
      )}
    </div>
  );
};

export default MusclesGraph;
