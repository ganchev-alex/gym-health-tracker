import React from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import modals, {
  setEssentialPreviewModalState,
  setHelpModalState,
} from "../../../features/modals";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import styles from "./EssentialsPreview.module.css";
import { RootState } from "../../../features/store";
import LoadingPlane from "../../UI/loading_plane/LoadingPlane";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Backdrop = function () {
  const dispatch = useDispatch();
  return (
    <div
      className={styles.backdrop}
      onClick={() =>
        dispatch(setEssentialPreviewModalState({ visibility: false }))
      }
    />
  );
};

const EssentialsPreview = function () {
  const dispatch = useDispatch();

  const { essential, metrix, color } = useSelector(
    (state: RootState) => state.modalsManager.summaryPreviewModal
  );
  const { isLoading } = useSelector((state: RootState) => state.loadingManager);

  const { statsData } = useSelector(
    (state: RootState) => state.statsData.essentialsGraphs
  );

  function getDateNDaysAgo(n: number) {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date;
  }

  const data = Array.from({ length: 30 }, (_, index) => ({
    date: getDateNDaysAgo(index),
    value: 0,
  }));

  statsData.forEach((set) => {
    const referenceDate = new Date(set.date);
    const index = data.findIndex(
      (subSet) =>
        subSet.date.getDate() === referenceDate.getDate() &&
        subSet.date.getMonth() === referenceDate.getMonth()
    );

    if (index >= 0) {
      data[index].value = set.value;
    }
  });

  const lineConfig = {
    data: {
      labels: data.map((set) => set.date.getDate()).reverse(),
      datasets: [
        {
          label: metrix,
          data: data.map((set) => set.value).reverse(),
          borderColor: color,
          cubicInterpolationMode: "monotone",
        },
      ],
    },
    options: {
      repsonsive: true,
      scales: {
        x: {
          ticks: {
            color: "black",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "black",
          },
          grid: {
            color: "white",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };
  return (
    <div className={styles.modal}>
      <h3>
        Last 30 Days Preview: <span style={{ color }}>{essential}</span>
      </h3>
      {isLoading ? (
        <LoadingPlane />
      ) : (
        <Line data={lineConfig.data as any} options={lineConfig.options} />
      )}
      <button
        style={{ borderColor: color, color }}
        onClick={() =>
          dispatch(setEssentialPreviewModalState({ visibility: false }))
        }
      >
        Close
      </button>
    </div>
  );
};

const EssentialsPreviewModal = function () {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<EssentialsPreview />, overlayRoot)}
    </React.Fragment>
  );
};

export default EssentialsPreviewModal;
