import React from "react";

import styles from "./CardBottom.module.css";

import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";

const CardBottom: React.FC<{ duration: string; category: string }> = (
  props
) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles["info-wrapper"]}>
        <span className={styles["duration-lable"]}>
          <TimerIcon />
          <p>{props.duration}</p>
        </span>
        <p>{props.category}</p>
      </span>
      <button className={styles.button}>Start Routine</button>
    </div>
  );
};

export default CardBottom;
