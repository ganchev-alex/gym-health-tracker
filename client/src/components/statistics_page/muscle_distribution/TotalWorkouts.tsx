import { useSelector } from "react-redux";
import styles from "./TotalWorkouts.module.css";
import { RootState } from "../../../features/store";

const TotalWorkouts = function () {
  const { totals, timeSpan } = useSelector(
    (state: RootState) => state.statsData
  );
  return (
    <div className={styles.grid}>
      <p>
        Total Workouts: <span>{totals.totalWorkouts}</span>
      </p>
      <p>
        Total Sessions: <span>{totals.totalActivities}</span>
      </p>
      <p>
        {timeSpan[0].toUpperCase() + timeSpan.slice(1) + "ly"} Workouts:
        <span>{totals.workoutPeriodCount}</span>
      </p>
      <p>
        {timeSpan[0].toUpperCase() + timeSpan.slice(1) + "ly"} Sessions:
        <span>{totals.activityPeriodCount}</span>
      </p>
    </div>
  );
};

export default TotalWorkouts;
