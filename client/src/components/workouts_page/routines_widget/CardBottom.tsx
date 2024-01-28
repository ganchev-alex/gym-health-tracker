import React from "react";

import styles from "./CardBottom.module.css";

import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";

const CardBottom: React.FC<{ duration: number; category: string }> = (
  props
) => {
  const hours = Math.floor(props.duration / 3600);
  const minutes = Math.floor((props.duration % 3600) / 60);
  return (
    <div className={styles.wrapper}>
      <span className={styles["info-wrapper"]}>
        <span className={styles["duration-lable"]}>
          <TimerIcon />
          <p>
            0{hours}:{minutes < 10 ? 0 : ""}
            {minutes}
          </p>
        </span>
        <p>{props.category}</p>
      </span>
      <button className={styles.button}>Start Routine</button>
    </div>
  );
};

export default CardBottom;
