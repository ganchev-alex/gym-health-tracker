import React from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  setNotificationState,
  setRoutineOptionsState,
  setRoutinePreviewState,
  showHistoryRecords,
} from "../../../features/workout-page-actions";
import { RootState } from "../../../features/store";

import CardBottom from "./CardBottom";

import styles from "./WorkoutCard.module.css";

const WorkoutCard: React.FC<{
  _id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  previewMode?: boolean;
  volume?: number;
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

  const isToday = useSelector(
    (state: RootState) => state.healthEssentials.isToday
  );

  const openHistory = function () {
    const today = new Date();
    if (isToday) {
      dispatch(showHistoryRecords(today.toISOString()));
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dispatch(showHistoryRecords(yesterday.toISOString()));
    }
  };

  return (
    <div
      className={styles.card}
      onClick={props.previewMode ? openHistory : openPreview}
    >
      <div className={styles.header}>
        <input type="hidden" value={props._id} />
        <h6>{props.name}</h6>
        {!props.previewMode && (
          <button type="button" onClick={openOptions}>
            <div />
            <div />
            <div />
          </button>
        )}
      </div>
      <p className={styles.description}>{props.description}</p>
      <CardBottom
        routineId={props._id}
        name={props.name}
        duration={props.duration}
        category={props.category}
        previewMode={props.previewMode}
        volume={props.volume}
      />
    </div>
  );
};

export default WorkoutCard;
