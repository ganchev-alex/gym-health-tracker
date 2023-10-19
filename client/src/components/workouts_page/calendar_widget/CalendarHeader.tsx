import { current } from "@reduxjs/toolkit";

import styles from "./CalendarHeader.module.css";

import CalendarLeftArrowIcon from "../../../assets/svg_icon_components/CalendarLeftArrowIcon";
import CalendarRightArrowIcon from "../../../assets/svg_icon_components/CalendarRightArrowIcon";

const CalendarHeader: React.FC<{
  currantMonth: number;
  onSetCurrantMonth: React.Dispatch<React.SetStateAction<number>>;
  currantYear: number;
  onSetCurrantYear: React.Dispatch<React.SetStateAction<number>>;
  today: Date;
  onSetToday: React.Dispatch<React.SetStateAction<Date>>;
}> = function (props) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const onChangeMonth = (direction: string) => {
    let newMonth = props.currantMonth;
    let newYear = props.currantYear;

    if (direction === "prev") {
      newMonth -= 1;
      if (newMonth < 0) {
        newMonth = 11; // Go to December
        newYear -= 1;
      }
    } else {
      newMonth += 1;
      if (newMonth > 11) {
        newMonth = 0; // Go to January
        newYear += 1;
      }
    }

    props.onSetCurrantMonth(newMonth);
    props.onSetCurrantYear(newYear);

    if (newYear !== props.currantYear || newMonth !== props.currantMonth) {
      props.onSetToday(new Date(newYear, newMonth, new Date().getDate()));
    }
  };

  const onResetToday = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    props.onSetToday(currentDate);
    props.onSetCurrantMonth(currentMonth);
    props.onSetCurrantYear(currentYear);
  };

  return (
    <div className={styles["calendar-header"]}>
      <p>
        {months[props.currantMonth]}, {props.currantYear}
      </p>
      <div className={styles["buttons-wrapper"]}>
        <button
          className={styles["month-button"]}
          onClick={() => {
            onChangeMonth("prev");
          }}
        >
          {<CalendarLeftArrowIcon />}
        </button>
        <button className={styles["today-button"]} onClick={onResetToday}>
          Today
        </button>
        <button
          className={styles["month-button"]}
          onClick={() => {
            onChangeMonth("next");
          }}
        >
          {<CalendarRightArrowIcon />}
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
