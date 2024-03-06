import React from "react";
import styles from "./WeekDays.module.css";

const WeekDays = function () {
  const today = new Date();
  //   From sunday: const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
  const firstDay = new Date(
    today.setDate(today.getDate() - ((today.getDay() + 6) % 7))
  );
  const weekDates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(firstDay);
    newDate.setDate(newDate.getDate() + i);
    weekDates.push(newDate);
  }

  return (
    <React.Fragment>
      <div className={styles.header}>
        <h5>Last 7 days body graph</h5>
        <button>?</button>
      </div>
      <div className={styles["days-holder"]}>
        {weekDates.map((date) => {
          return (
            <div className={styles["day-slot"]}>
              <p>{date.toDateString().charAt(0)}</p>
              <span
                className={`${
                  date.getDate() % 2 === 0 ? styles.completed : ""
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
