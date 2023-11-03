import TimerIcon from "../../assets/svg_icon_components/TimerIcon";

import styles from "./Timer.module.css";

const Timer: React.FC = function () {
  return (
    <div className={styles.widget}>
      <div className={styles.gradient}></div>
      <img
        className={styles.image}
        src="https://images.unsplash.com/photo-1587938745570-681161dcfe17?auto=format&fit=crop&q=80&w=1966&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <div className={styles["timer-display"]}>
        <span>Rest Time</span>
        <p>01:57</p>
        <div className={styles.controlls}>
          <button>-15 s.</button>
          <TimerIcon />
          <button>+15 s.</button>
        </div>
      </div>
      <div className={styles["duration"]}>
        <span>Duration</span>
        <p>00:43:52</p>
      </div>
    </div>
  );
};

export default Timer;
