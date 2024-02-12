import React, { useEffect, useState } from "react";
import CalendarBody from "./CalendarBody";
import CalendarHeader from "./CalendarHeader";
import Widget from "../../layout/Widget";

import styles from "./Calendar.module.css";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  appendHistory,
  setNotificationState,
} from "../../../features/workout-page-actions";
import { RootState } from "../../../features/store";
import { Session } from "../history_preview/HistoryPreview";

const Calendar = function () {
  const dispatch = useDispatch();
  const [localLoadingState, setLocalLoadingState] = useState(false);

  const [today, setToday] = useState<Date>(new Date());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const savedHistoryData = useSelector(
    (state: RootState) => state.widgetsManager.calendarWidget.monthData
  );

  const trigger = useSelector(
    (state: RootState) => state.workoutState.workoutActivity
  );

  let firstDayMonth = new Date(currentYear, currentMonth, 1).getDay();
  firstDayMonth = firstDayMonth === 0 ? 6 : firstDayMonth - 1;
  const lastDateMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  let lastDayMonth = new Date(
    currentYear,
    currentMonth,
    lastDateMonth
  ).getDay();
  lastDayMonth = lastDayMonth === 0 ? 6 : lastDayMonth - 1;
  const lastDateLastMonth = new Date(currentYear, currentMonth, 0).getDate();

  useEffect(() => {
    const getUserHistory = async function () {
      try {
        setLocalLoadingState(true);
        const response = await fetch(
          `${mainAPIPath}/app/user-history?month=${currentMonth}&year=${currentYear}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (response.status === 200) {
          const data: {
            workoutHistory: {
              date: string;
              workout: string;
            }[];
            sessionHistory: {
              session: Session;
            }[];
          } = await response.json();
          dispatch(
            appendHistory({
              month: currentMonth,
              year: currentYear,
              workoutRecords: data.workoutHistory.map((record) => {
                return {
                  workoutId: record.workout,
                  date: record.date,
                };
              }),
              sessionRecords: data.sessionHistory.map((record) => {
                return {
                  date: record.session.date,
                  title: record.session.title,
                  category: record.session.category,
                  duration: record.session.duration,
                  burntCalories: record.session.burntCalories,
                };
              }),
            })
          );
        } else if (response.status === 500 || response.status === 404) {
          dispatch(
            setNotificationState({
              message: "😓 Couldn't load history data",
              visibility: true,
            })
          );

          setTimeout(() => {
            dispatch(setNotificationState({ visibility: false }));
          }, 4000);
        }
      } catch (error) {
        dispatch(
          setNotificationState({
            message: "😓 Couldn't load history data",
            visibility: true,
          })
        );

        setTimeout(() => {
          dispatch(setNotificationState({ visibility: false }));
        }, 4000);
      } finally {
        setLocalLoadingState(false);
      }
    };

    const referenceDate = new Date();

    if (
      currentYear < referenceDate.getFullYear() ||
      (currentYear === referenceDate.getFullYear() &&
        currentMonth <= referenceDate.getMonth())
    ) {
      if (
        !savedHistoryData.some(
          (record) =>
            record.month === currentMonth && record.year === currentYear
        )
      ) {
        getUserHistory();
      }
    }
  }, [currentMonth, currentYear, dispatch, trigger]);

  return (
    <React.Fragment>
      <div className={styles.widget}>
        <div className={styles.calendar}>
          <CalendarHeader
            currantMonth={currentMonth}
            onSetCurrantMonth={setCurrentMonth}
            currantYear={currentYear}
            onSetCurrantYear={setCurrentYear}
            today={today}
            onSetToday={setToday}
          />
          <CalendarBody
            currantDate={today}
            currantMonth={currentMonth}
            currantYear={currentYear}
            firstDayMonth={firstDayMonth}
            lastDateMonth={lastDateMonth}
            lastDayMonth={lastDayMonth}
            lastDateLastMonth={lastDateLastMonth}
            loadingState={localLoadingState}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Calendar;
