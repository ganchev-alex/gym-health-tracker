import styles from "./CalendarBody.module.css";

const CalendarBody: React.FC<{
  currantDate: Date;
  currantMonth: number;
  currantYear: number;
  firstDayMonth: number;
  lastDateMonth: number;
  lastDayMonth: number;
  lastDateLastMonth: number;
}> = function (props) {
  let daysList: JSX.Element[] = [];

  // Previous month's last days
  for (let i = props.firstDayMonth; i > 0; i--) {
    daysList.push(
      <li key={`-${i}`} className={styles["not-this-month"]}>
        {props.lastDateLastMonth - i + 1}
      </li>
    );
    // Adding an haveWorkout state on previous month
    // Apply a not this month class...
  }

  for (let i = 1; i <= props.lastDateMonth; i++) {
    // Adding an haveWorkout state and today to the currant element
    const isToday =
      i === props.currantDate.getDate() &&
      props.currantMonth === new Date().getMonth() &&
      props.currantYear === new Date().getFullYear();

    daysList.push(
      <li key={i} className={`${isToday ? styles.today : ""}`}>
        {i}
      </li>
    );
  }

  for (let i = props.lastDayMonth; i < 6; i++) {
    // Adding a not this month class...
    daysList.push(
      <li key={`+${i}`} className={styles["not-this-month"]}>
        {i - props.lastDayMonth + 1}
      </li>
    );
  }

  return (
    <div className={styles["calendar-body"]}>
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
