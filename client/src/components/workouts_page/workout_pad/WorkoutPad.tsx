import { useDispatch, useSelector } from "react-redux";
import styles from "./WorkoutPad.module.css";
import {
  decreaseRestTimer,
  incrementWorkoutDuration,
  operateOnRestTimer,
  setRestTimerState,
} from "../../../features/workout";
import { useEffect } from "react";
import { RootState } from "../../../features/store";
import React from "react";

const WorkoutPad = function () {
  const dispatch = useDispatch();

  const workoutState = useSelector((state: RootState) => {
    return state.workoutState;
  });

  const {
    workoutActivity,
    workoutTitle: routineTitle,
    duration,
    restTimer,
  } = workoutState;
  const { active, timer } = restTimer;

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const remainingSeconds = duration % 60;

  const restMinutes = Math.floor((timer % 3600) / 60);
  const restSeconds = timer % 60;

  return (
    <div className={styles.widget}>
      <div className={styles.headings}>
        <h5>
          {workoutState.workoutActivity ? routineTitle : "No workout acitve"}
        </h5>
        {workoutState.workoutActivity && (
          <React.Fragment>
            <h6>Workout in progress...</h6>
            <p>
              Duration:{" "}
              {`${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                2,
                "0"
              )}:${String(remainingSeconds).padStart(2, "0")}`}
            </p>
          </React.Fragment>
        )}
      </div>
      <div className={styles.timer} style={active ? {} : { opacity: 0.6 }}>
        <button
          disabled={!active}
          onClick={() => {
            dispatch(operateOnRestTimer({ increment: false, value: 15 }));
          }}
        >
          - 15
        </button>
        <h6>{`${String(restMinutes).padStart(2, "0")}:${String(
          restSeconds
        ).padStart(2, "0")}`}</h6>
        <button
          disabled={!active}
          onClick={() => {
            dispatch(operateOnRestTimer({ increment: true, value: 15 }));
          }}
        >
          + 15
        </button>
      </div>
    </div>
  );
};

export default WorkoutPad;
