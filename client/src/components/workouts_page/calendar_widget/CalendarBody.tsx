import { useDispatch, useSelector } from "react-redux";
import styles from "./CalendarBody.module.css";
import { RootState } from "../../../features/store";
import LoadingPlane from "../../UI/LoadingPlane/LoadingPlane";
import { showHistoryRecords } from "../../../features/widgets-actions";

const CalendarBody: React.FC<{
  currantDate: Date;
  currantMonth: number;
  currantYear: number;
  firstDayMonth: number;
  lastDateMonth: number;
  lastDayMonth: number;
  lastDateLastMonth: number;
}> = function (props) {
  const dispatch = useDispatch();

  let daysList: JSX.Element[] = [];
  const savedHistoryData = useSelector((state: RootState) => {
    return state.widgetsManager.calendarWidget.monthData.find(
      (monthChunk) =>
        monthChunk.month === props.currantMonth &&
        monthChunk.year === props.currantYear
    );
  });

  const isLoading = useSelector((state: RootState) => {
    return state.loadingManager.isLoading;
  });

  const historyMode = useSelector((state: RootState) => {
    return state.widgetsManager.calendarWidget.previewRecords.length > 0;
  });
  // Previous month's last days
  for (let i = props.firstDayMonth; i > 0; i--) {
    daysList.push(
      <li key={`-${i}`} className={styles["not-this-month"]}>
        {props.lastDateLastMonth - i + 1}
      </li>
    );
  }

  for (let i = 1; i <= props.lastDateMonth; i++) {
    // Adding an haveWorkout state and today to the currant element
    const isToday =
      i === props.currantDate.getDate() &&
      props.currantMonth === new Date().getMonth() &&
      props.currantYear === new Date().getFullYear();

    if (savedHistoryData) {
      const possibleRecord = savedHistoryData.workoutRecords.find(
        (record) => new Date(record.date).getDate() === i
      );
      daysList.push(
        <li
          key={i}
          className={`${isToday ? styles.today : ""} ${
            possibleRecord ? styles.active : ""
          }`}
          onClick={
            possibleRecord
              ? () => {
                  dispatch(showHistoryRecords(possibleRecord.date));
                }
              : () => {}
          }
        >
          {i}
        </li>
      );
    } else {
      daysList.push(
        <li key={i} className={`${isToday ? styles.today : ""}`}>
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
      {isLoading && !historyMode && <LoadingPlane />}
      <ul className={styles.weeks}>
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
