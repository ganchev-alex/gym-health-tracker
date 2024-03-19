import { useSelector } from "react-redux";
import styles from "./TotalWorkouts.module.css";
import { RootState } from "../../../features/store";

const TotalWorkouts = function () {
  const { totals, timeSpan } = useSelector(
    (state: RootState) => state.statsData
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <div className={styles.grid}>
      <p>
        Total Workouts:{" "}
        <span style={isMale ? { color: "#472ed8" } : undefined}>
          {totals.totalWorkouts}
        </span>
      </p>
      <p>
        Total Sessions:{" "}
        <span style={isMale ? { color: "#472ed8" } : undefined}>
          {totals.totalActivities}
        </span>
      </p>
      <p>
        {timeSpan[0].toUpperCase() + timeSpan.slice(1) + "ly"} Workouts:
        <span style={isMale ? { color: "#472ed8" } : undefined}>
          {totals.workoutPeriodCount}
        </span>
      </p>
      <p>
        {timeSpan[0].toUpperCase() + timeSpan.slice(1) + "ly"} Sessions:
        <span style={isMale ? { color: "#472ed8" } : undefined}>
          {totals.activityPeriodCount}
        </span>
      </p>
    </div>
  );
};

export default TotalWorkouts;
