import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { operateOnRestTimer } from "../../../features/workout";
import { RootState } from "../../../features/store";

import styles from "./WorkoutPad.module.css";

const WorkoutPad = function () {
  const dispatch = useDispatch();

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const workoutState = useSelector((state: RootState) => state.workoutState);

  const { workoutTitle: routineTitle, duration, restTimer } = workoutState;
  const { active, timer } = restTimer;

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const remainingSeconds = duration % 60;

  const restMinutes = Math.floor((timer % 3600) / 60);
  const restSeconds = timer % 60;

  return (
    <div
      className={styles.widget}
      style={
        isMale
          ? {
              background:
                "linear-gradient(-125deg, #472ED8 20.25%, #29156B 100%)",
            }
          : undefined
      }
    >
      <div className={styles.headings}>
        <h5>
          {workoutState.workoutActivity ? routineTitle : "No active workout."}
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
