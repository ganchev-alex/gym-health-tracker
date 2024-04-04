import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../features/store";
import { setWorkoutState } from "../../../features/workout";

import styles from "./RouteButton.module.css";
import {
  resetHistoryRecords,
  setFormVisibility,
  setRoutinePreviewState,
} from "../../../features/workout-page-actions";
import { setAccountModalVisibility } from "../../../features/modals";

const RouteButton: React.FC<{
  path: string;
  icon: React.ReactNode;
  isAccount?: boolean;
}> = (props) => {
  const dispatch = useDispatch();
  const { isMale } = useSelector((state: RootState) => state.userActions);

  const { workoutVisibility } = useSelector(
    (state: RootState) => state.workoutState
  );

  const activeClassSelector = function ({ isActive }: { isActive: boolean }) {
    let classes = styles.wrapper;
    if (isActive) {
      classes += " " + styles["active-route"];
      if (isMale) {
        classes += " " + styles["active-color-male"];
      } else {
        classes += " " + styles["active-color-female"];
      }
    }
    return classes;
  };

  const onClickHandler = function () {
    if (workoutVisibility) {
      dispatch(setWorkoutState({ visibility: false }));
    }
    dispatch(setRoutinePreviewState({ visibility: false }));
    dispatch(setFormVisibility(false));
    dispatch(resetHistoryRecords());
    dispatch(setAccountModalVisibility(false));
  };

  return (
    <li className={styles.button}>
      <NavLink
        className={activeClassSelector}
        to={props.path}
        onClick={onClickHandler}
      >
        <div>{props.icon}</div>
      </NavLink>
    </li>
  );
};

export default RouteButton;
