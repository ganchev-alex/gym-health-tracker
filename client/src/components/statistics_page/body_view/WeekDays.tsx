import React from "react";
import styles from "./WeekDays.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setHelpModalState } from "../../../features/modals";
import { RootState } from "../../../features/store";

const WeekDays = function () {
  const dispatch = useDispatch();

  const today = new Date();
  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(today);
    newDate.setDate(today.getDate() - i);
    weekDates.push(newDate);
  }

  const { activityDates } = useSelector(
    (state: RootState) => state.statsData.muscleGraph
  );

  return (
    <React.Fragment>
      <div className={styles.header}>
        <h5>Last 7 days body graph</h5>
        <button
          onClick={() =>
            dispatch(
              setHelpModalState({
                visibility: true,
                tip: "This body image shows the muscles which you have worked out in the last 7 days. You must drive to always having targeted all muscle groups when looking 7 days behind.",
              })
            )
          }
        >
          ?
        </button>
      </div>
      <div className={styles["days-holder"]}>
        {weekDates.reverse().map((date) => {
          return (
            <div className={styles["day-slot"]}>
              <p
                style={
                  date.getDate() === new Date().getDate()
                    ? { color: "#E54C60", fontWeight: 800 }
                    : {}
                }
              >
                {date.toDateString().charAt(0)}
              </p>
              <span
                className={`${
                  activityDates.includes(date.getDate()) ? styles.completed : ""
                }`}
              >
                {date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default WeekDays;
