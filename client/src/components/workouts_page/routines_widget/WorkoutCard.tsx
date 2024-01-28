import React from "react";

import CardBottom from "./CardBottom";

import styles from "./WorkoutCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setNotificationState,
  setRoutineOptionsState,
  setRoutinePreviewState,
} from "../../../features/widgets-actions";
import { RootState } from "../../../features/store";

const WorkoutCard: React.FC<{
  _id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
}> = (props) => {
  const dispatch = useDispatch();

  const routines = useSelector((state: RootState) => {
    return state.userActions.loadedUserData.routines;
  });

  const openOptions = function (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();
    dispatch(
      setRoutineOptionsState({ visibility: true, routineId: props._id })
    );
  };

  const openPreview = function () {
    const routineData = routines.find((routine) => {
      return routine._id === props._id;
    });

    if (routineData) {
      dispatch(
        setRoutinePreviewState({
          visibility: true,
          routineId: props._id,
          routineData,
        })
      );
    } else {
      dispatch(
        setNotificationState({
          visibility: true,
          message: "😓 Failed to load routine.",
        })
      );

      setTimeout(() => {
        dispatch(setNotificationState({ visibility: false }));
      }, 4000);
    }
  };

  return (
    <div className={styles.card} onClick={openPreview}>
      <div className={styles.header}>
        <input type="hidden" value={props._id} />
        <h6>{props.name}</h6>
        <button type="button" onClick={openOptions}>
          <div />
          <div />
          <div />
        </button>
      </div>
      <p className={styles.description}>{props.description}</p>
      <CardBottom duration={props.duration} category={props.category} />
    </div>
  );
};

export default WorkoutCard;
