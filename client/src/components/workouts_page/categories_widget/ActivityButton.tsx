import React from "react";

import styles from "./ActivityButton.module.css";
import { useDispatch } from "react-redux";
import { setSessionActivity } from "../../../features/widgets-actions";
import { setWorkoutState, setWorkoutTitle } from "../../../features/workout";

const ActivityButton: React.FC<{ icon: React.ReactNode; mode: string }> = (
  props
) => {
  const dispatch = useDispatch();
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
    <button className={styles.button} onClick={quickStart}>
      {props.icon}
    </button>
  );
};

export default ActivityButton;
