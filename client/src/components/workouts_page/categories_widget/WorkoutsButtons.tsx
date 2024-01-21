import styles from "./WorkoutsButton.module.css";

const WorkoutsButton: React.FC = () => {
  const startEmptyWorkout = function () {};

  return (
    <div className={styles["button-holder"]}>
      <button className={styles["main-button"]}>Start Empty Workout</button>
      <button className={styles["secondary-button"]}>New Routine</button>
    </div>
  );
};

export default WorkoutsButton;
