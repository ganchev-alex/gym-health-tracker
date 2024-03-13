import { useEffect, useState } from "react";
import LeftArrowIcon from "../../../assets/svg_icon_components/CalendarLeftArrowIcon";
import RigthArrowIcon from "../../../assets/svg_icon_components/CalendarRightArrowIcon";
import styles from "./PeriodControl.module.css";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import {
  IEssentialsStats,
  IMuscleDistribution,
  ITotals,
  setStatistics,
  setTimeSpan,
} from "../../../features/statistics-actions";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationState } from "../../../features/workout-page-actions";
import { setLoadingState } from "../../../features/loading-actions";
import { RootState } from "../../../features/store";
import {
  formatDate,
  formatMonth,
  getEndOfWeek,
  getStartOfWeek,
  getWeekNumber,
} from "./periodControlUtil";

const timeSpanLabels = ["Week", "Month", "Year"];

const PeriodControl = function () {
  const dispatch = useDispatch();

  const timeSpan = useSelector((state: RootState) => state.statsData.timeSpan);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
  const [isCurrentWeek, setIsCurrentWeek] = useState(true);

  useEffect(() => {
    const today = new Date();
    setIsCurrentWeek(getWeekNumber(today) === getWeekNumber(currentWeek));

    const paramsList =
      timeSpan === "week"
        ? `week=${getWeekNumber(currentWeek)}&year=${currentWeek.getFullYear()}`
        : timeSpan === "month"
        ? `&month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}`
        : `year=${currentYear}`;

    const fetchStatistics = async function () {
      try {
        dispatch(setLoadingState(true));
        console.log(`span=${timeSpan.toLocaleLowerCase()} ` + paramsList);
        const response = await fetch(
          `${mainAPIPath}/stats/data?span=${timeSpan.toLocaleLowerCase()}&` +
            paramsList,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );

        if (response.ok) {
          const data: {
            distributionStats: IMuscleDistribution;
            totals: ITotals;
            essentialsStats: IEssentialsStats;
            muscleGroups: string[];
            activityDates: number[];
          } = await response.json();
          console.log("Data: ", data);
          dispatch(
            setStatistics({
              muscleDistribution: data.distributionStats,
              totals: data.totals,
              essentialsStats: data.essentialsStats,
              muscleGroups: data.muscleGroups,
              activityDates: data.activityDates,
            })
          );
        } else {
          dispatch(
            setNotificationState({
              message: "😨 Failed to load statistics.",
              visibility: true,
            })
          );
        }
      } catch (error) {
        dispatch(
          setNotificationState({
            message: "😨 Failed to load statistics.",
            visibility: true,
          })
        );
      } finally {
        dispatch(setLoadingState(false));
        setTimeout(() => {
          dispatch(
            setNotificationState({
              visibility: false,
            })
          );
        }, 400);
      }
    };

    const identifier = setTimeout(() => {
      fetchStatistics();
    }, 100);

    return () => {
      clearTimeout(identifier);
    };
  }, [currentWeek, currentDate]);

  const handleLeftArrowClick = () => {
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(previousWeek.getDate() - 7);
    setCurrentWeek(getStartOfWeek(previousWeek));

    if (timeSpan === "month") {
      const previousMonth = new Date(currentDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      setCurrentDate(previousMonth);
    }

    if (timeSpan === "year") {
      const previousYear = currentYear - 1;
      setCurrentYear(previousYear);
    }
  };

  const handleRightArrowClick = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(getStartOfWeek(nextWeek));

    if (timeSpan === "month") {
      const nextMonth = new Date(currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setCurrentDate(nextMonth);
    }

    if (timeSpan === "year") {
      const nextYear = currentYear + 1;
      setCurrentYear(nextYear);
    }
  };

  return (
    <div className={styles.widget}>
      <h6>Period of Statistics</h6>
      <div className={styles.selectors}>
        {timeSpanLabels.map((span, index) => (
          <button
            key={index}
            className={
              span.toLocaleLowerCase() === timeSpan ? styles.active : ""
            }
            onClick={() => {
              dispatch(setTimeSpan(span.toLocaleLowerCase()));
              setCurrentDate(new Date());
              setCurrentYear(new Date().getFullYear());
              setCurrentWeek(getStartOfWeek(new Date()));
            }}
          >
            {span}
          </button>
        ))}
      </div>
      <div className={styles.display}>
        <button onClick={handleLeftArrowClick}>
          <LeftArrowIcon />
        </button>
        <p>
          {timeSpan === "week"
            ? formatDate(currentWeek) +
              " ~ " +
              formatDate(getEndOfWeek(currentWeek))
            : timeSpan === "month"
            ? formatMonth(currentDate)
            : currentYear}
        </p>
        <button
          onClick={handleRightArrowClick}
          disabled={isCurrentWeek}
          style={isCurrentWeek ? { opacity: 0 } : {}}
        >
          <RigthArrowIcon />
        </button>
      </div>
    </div>
  );
};

export default PeriodControl;
