import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import styles from "./RouteButton.module.css";
import { setWorkoutVisibility } from "../../../features/workout";

const RouteButton: React.FC<{
  path: string;
  label: string;
  icon: React.ReactNode;
}> = (props) => {
  const dispatch = useDispatch();
  const toggleState = useSelector(
    (state: RootState) => state.navigation.toggleState
  );

  const { isShown } = useSelector((state: RootState) => state.workoutState);

  const activeClassSelector = function ({ isActive }: { isActive: boolean }) {
    let classes = styles.wrapper;
    if (!toggleState) {
      classes += " " + styles["untoggled-wrapper"];
    }
    if (isActive) {
      classes += " " + styles["active-route"];
    }
    return classes;
  };

  const onClickHandler = function () {
    if (isShown) {
      dispatch(setWorkoutVisibility());
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
