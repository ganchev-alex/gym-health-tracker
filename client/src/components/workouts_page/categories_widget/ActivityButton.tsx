import React from "react";

import styles from "./ActivityButton.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setSessionActivity } from "../../../features/workout-page-actions";
import { setWorkoutState, setWorkoutTitle } from "../../../features/workout";
import { RootState } from "../../../features/store";

const ActivityButton: React.FC<{ icon: React.ReactNode; mode: string }> = (
  props
) => {
  const dispatch = useDispatch();
  const { workoutActivity } = useSelector(
    (state: RootState) => state.workoutState
  );

  const quickStart = function () {
    dispatch(
      setSessionActivity({
        sessionActivity: true,
        selectedActivity: props.mode,
      })
    );
    dispatch(setWorkoutState({ visibility: true, activity: true }));
    dispatch(
      setWorkoutTitle(
        `${props.mode} Activity Session: ${new Date().toDateString()}`
      )
    );
  };

  return (
    <button
      className={`${styles.button} ${workoutActivity ? styles.inactive : ""}`}
      onClick={quickStart}
      disabled={workoutActivity}
    >
      {props.icon}
    </button>
  );
};

export default ActivityButton;
