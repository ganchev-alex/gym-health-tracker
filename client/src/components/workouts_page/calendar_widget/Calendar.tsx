import { useState } from "react";
import CalendarBody from "./CalendarBody";
import CalendarHeader from "./CalendarHeader";
import Widget from "../Widget";

import styles from "./Calendar.module.css";

const Calendar = function () {
  const [today, setToday] = useState<Date>(new Date());
  const [currantYear, setCurrantYear] = useState(today.getFullYear());
  const [currantMonth, setCurrantMonth] = useState(today.getMonth());

  let firstDayMonth = new Date(currantYear, currantMonth, 1).getDay();
  firstDayMonth = firstDayMonth === 0 ? 6 : firstDayMonth - 1;
  const lastDateMonth = new Date(currantYear, currantMonth + 1, 0).getDate();
  let lastDayMonth = new Date(
    currantYear,
    currantMonth,
    lastDateMonth
  ).getDay();
  lastDayMonth = lastDayMonth === 0 ? 6 : lastDayMonth - 1;
  const lastDateLastMonth = new Date(currantYear, currantMonth, 0).getDate();

  return (
    <Widget>
      <div className={styles.calendar}>
        <CalendarHeader
          currantMonth={currantMonth}
          onSetCurrantMonth={setCurrantMonth}
          currantYear={currantYear}
          onSetCurrantYear={setCurrantYear}
          today={today}
          onSetToday={setToday}
        />
        <CalendarBody
          currantDate={today}
          currantMonth={currantMonth}
          currantYear={currantYear}
          firstDayMonth={firstDayMonth}
          lastDateMonth={lastDateMonth}
          lastDayMonth={lastDayMonth}
          lastDateLastMonth={lastDateLastMonth}
        />
      </div>
    </Widget>
  );
};

export default Calendar;
