import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";

import styles from "./BottomCard.module.css";

const BottomCard: React.FC<{ category: string }> = function (props) {
  return (
    <div className={styles["bottom-wrapper"]}>
      <span className={styles["time-wrapper"]}>
        <TimerIcon />
        <p>1:15 hour</p>
      </span>
      <p className={styles.category}>{props.category}</p>
      <a>Learn More</a>
    </div>
  );
};

export default BottomCard;
