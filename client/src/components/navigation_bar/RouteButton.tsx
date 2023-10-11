import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

import styles from "./RouteButton.module.css";

const RouteButton: React.FC<{
  path: string;
  label: string;
  icon: React.ReactNode;
}> = (props) => {
  const toggleState = useSelector(
    (state: RootState) => state.navigation.toggleState
  );
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

  return (
    <li>
      <NavLink className={activeClassSelector} to={props.path}>
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
