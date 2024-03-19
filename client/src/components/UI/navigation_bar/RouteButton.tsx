import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../features/store";
import { setWorkoutState } from "../../../features/workout";

import styles from "./RouteButton.module.css";

const RouteButton: React.FC<{
  path: string;
  label: string;
  icon: React.ReactNode;
}> = (props) => {
  const dispatch = useDispatch();

  const toggleState = useSelector(
    (state: RootState) => state.styleManager.toggleState
  );
  const { isMale } = useSelector((state: RootState) => state.userActions);

  const { workoutVisibility } = useSelector(
    (state: RootState) => state.workoutState
  );

  const activeClassSelector = function ({ isActive }: { isActive: boolean }) {
    let classes = styles.wrapper;
    if (!toggleState) {
      classes += " " + styles["untoggled-wrapper"];
    }
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
  };

  return (
    <li className={styles.button}>
      <NavLink
        className={activeClassSelector}
        to={props.path}
        onClick={onClickHandler}
      >
        <div>{props.icon}</div>
        <span
          className={`${styles.label} ${
            toggleState ? styles["hidden-label"] : ""
          }`}
        >
          {props.label}
        </span>
      </NavLink>
    </li>
  );
};

export default RouteButton;
