import { useDispatch, useSelector } from "react-redux";
import styles from "./TimespanControlls.module.css";
import { setDataStream } from "../../../features/health-essentials-actions";
import { RootState } from "../../../features/store";

const TimespanControlls = function () {
  const dispatch = useDispatch();
  const isToday = useSelector(
    (state: RootState) => state.healthEssentials.isToday
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <div className={styles.controlls}>
      <h4 style={isMale ? { color: "#472ed8" } : undefined}>Daily Tracker</h4>
      <button
        className={styles.yesterday}
        onClick={() => {
          dispatch(setDataStream());
        }}
        style={isToday ? { color: isMale ? "#472ed8" : "#e54c60" } : undefined}
      >
        {isToday ? "Today" : "Yesterday"}
      </button>
    </div>
  );
};

export default TimespanControlls;
