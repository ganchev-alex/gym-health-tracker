import { useDispatch, useSelector } from "react-redux";
import styles from "./TimespanControlls.module.css";
import { setDataStream } from "../../../features/health-essentials-actions";
import { RootState } from "../../../features/store";

const TimespanControlls = function () {
  const dispatch = useDispatch();
  const isToday = useSelector(
    (state: RootState) => state.healthEssentials.isToday
  );
  return (
    <div className={styles.controlls}>
      <h4>Daily Tracker</h4>
      <button
        className={styles.yesterday}
        onClick={() => {
          dispatch(setDataStream());
        }}
        style={isToday ? { color: "#E54C60" } : undefined}
      >
        {isToday ? "Today" : "Yesterday"}
      </button>
    </div>
  );
};

export default TimespanControlls;
