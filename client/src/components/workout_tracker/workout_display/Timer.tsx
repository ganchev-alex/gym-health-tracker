import { useDispatch, useSelector } from "react-redux";
import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";

import styles from "./Timer.module.css";
import { operateOnRestTimer } from "../../../features/workout";
import { RootState } from "../../../features/store";

const Timer: React.FC = function () {
  const dispatch = useDispatch();
  const duration = useSelector((state: RootState) => {
    return state.workoutState.duration;
  });
  const { timer, active } = useSelector((state: RootState) => {
    return state.workoutState.restTimer;
  });

  const { totalSets, totalVolume } = useSelector((state: RootState) => {
    return state.workoutState;
  });

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const remainingSeconds = duration % 60;

  const restMinutes = Math.floor((timer % 3600) / 60);
  const restSeconds = timer % 60;

  return (
    <div className={styles.widget}>
      <div
        className={`${isMale ? styles.male : styles.female} ${styles.gradient}`}
      />
      <img
        className={styles.image}
        src="https://images.unsplash.com/photo-1587938745570-681161dcfe17?auto=format&fit=crop&q=80&w=1966&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div
        className={styles["timer-display"]}
        style={active ? {} : { opacity: 0.5 }}
      >
        <span>Rest Time</span>
        <p>
          {`${String(restMinutes).padStart(2, "0")}:${String(
            restSeconds
          ).padStart(2, "0")}`}
        </p>
        <div className={styles.controlls}>
          <button
            disabled={!active}
            onClick={() => {
              dispatch(operateOnRestTimer({ increment: false, value: 15 }));
            }}
          >
            -15 s.
          </button>
          <TimerIcon />
          <button
            disabled={!active}
            onClick={() => {
              dispatch(operateOnRestTimer({ increment: true, value: 15 }));
            }}
          >
            +15 s.
          </button>
        </div>
      </div>
      <div className={styles["stats"]}>
        <span>Duration</span>
        <p>{`${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(remainingSeconds).padStart(2, "0")}`}</p>
        <div className={styles["totals"]}>
          <p>
            Total Volume: <b>{totalVolume}</b>
          </p>
          <p>
            Total Sets: <b>{totalSets}</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Timer;
