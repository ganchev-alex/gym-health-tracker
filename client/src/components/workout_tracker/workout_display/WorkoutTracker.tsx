import Timer from "./Timer";
import WorkoutDisplay from "./WorkoutDisplay";

import styles from "./WorkoutTracker.module.css";

const WorkoutTracker: React.FC = () => {
  return (
    <div className={styles.modal}>
      <WorkoutDisplay />
      <div className={styles.sidebar}>
        <Timer />
        <div className={styles["buttons-wrapper"]}>
          <button>Discard Workout</button>
          <button>Finish Workout</button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTracker;
