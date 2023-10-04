import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./RouteButton.module.css";

const RouteButton: React.FC<{
  path: string;
  label: string;
  icon: React.ReactNode;
}> = (props) => {
  const activeClassSelector = function ({ isActive }: { isActive: boolean }) {
    return isActive ? styles["active-route"] : undefined;
  };

  return (
    <li className={styles.link}>
      <NavLink className={activeClassSelector} to={props.path}>
        <div>{props.icon}</div>
        <span className={styles["hidden-label"]}>{props.label}</span>
      </NavLink>
    </li>
  );
};

export default RouteButton;
