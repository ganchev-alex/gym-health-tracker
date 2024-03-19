import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../features/store";
import { showHistoryRecords } from "../../../features/workout-page-actions";

import LoadingPlane from "../../UI/LoadingPlane/LoadingPlane";

import styles from "./CalendarBody.module.css";

const CalendarBody: React.FC<{
  currantDate: Date;
  currantMonth: number;
  currantYear: number;
  firstDayMonth: number;
  lastDateMonth: number;
  lastDayMonth: number;
  lastDateLastMonth: number;
  loadingState: boolean;
}> = function (props) {
  const dispatch = useDispatch();

  const { isMale } = useSelector((state: RootState) => state.userActions);

  let daysList: JSX.Element[] = [];
  const savedHistoryData = useSelector((state: RootState) => {
    return state.widgetsManager.calendarWidget.monthData.find(
      (monthChunk) =>
        monthChunk.month === props.currantMonth &&
        monthChunk.year === props.currantYear
    );
  });

  for (let i = props.firstDayMonth; i > 0; i--) {
    daysList.push(
      <li key={`-${i}`} className={styles["not-this-month"]}>
        {props.lastDateLastMonth - i + 1}
      </li>
    );
  }

  for (let i = 1; i <= props.lastDateMonth; i++) {
    const isToday =
      i === props.currantDate.getDate() &&
      props.currantMonth === new Date().getMonth() &&
      props.currantYear === new Date().getFullYear();

    if (savedHistoryData) {
      const possibleWorkoutRecord = savedHistoryData.workoutRecords.find(
        (record) => new Date(record.date).getDate() === i
      );
      const possibleSessionRecord = savedHistoryData.sessionRecords.find(
        (record) => new Date(record.date).getDate() === i
      );
      daysList.push(
        <li
          key={i}
          className={`${isToday ? styles.today : ""} ${
            possibleWorkoutRecord || possibleSessionRecord
              ? `${isMale ? styles.male : styles.female} ${styles.active}`
              : ""
          }`}
          style={
            isToday ? { color: isMale ? "#472ed8" : "#e54c60" } : undefined
          }
          onClick={
            possibleWorkoutRecord || possibleSessionRecord
              ? () => {
                  if (possibleWorkoutRecord) {
                    dispatch(showHistoryRecords(possibleWorkoutRecord.date));
                  } else if (possibleSessionRecord) {
                    dispatch(showHistoryRecords(possibleSessionRecord.date));
                  }
                }
              : undefined
          }
        >
          {i}
        </li>
      );
    } else {
      daysList.push(
        <li
          key={i}
          className={`${isToday ? styles.today : ""}`}
          style={
            isToday ? { color: isMale ? "#472ed8" : "#e54c60" } : undefined
          }
        >
          {i}
        </li>
      );
    }
  }

  for (let i = props.lastDayMonth; i < 6; i++) {
    daysList.push(
      <li key={`+${i}`} className={styles["not-this-month"]}>
        {i - props.lastDayMonth + 1}
      </li>
    );
  }

  return (
    <div className={styles["calendar-body"]}>
      {props.loadingState && <LoadingPlane />}
      <ul className={`${isMale ? styles.male : styles.female} ${styles.weeks}`}>
        <li>Mon</li>
        <li>Tue</li>
        <li>Wed</li>
        <li>Thu</li>
        <li>Fri</li>
        <li>Sat</li>
        <li>Sun</li>
      </ul>
      <ul className={styles.days}>
        {daysList.map((day) => {
          return day;
        })}
      </ul>
    </div>
  );
};

export default CalendarBody;
