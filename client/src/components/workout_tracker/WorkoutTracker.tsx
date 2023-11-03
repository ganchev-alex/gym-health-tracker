import Timer from "./Timer";
import WorkoutDisplay from "./WorkoutDisplay";

import styles from "./WorkoutTracker.module.css";

const WorkoutTracker: React.FC = () => {
  return (
    <div className={styles.model}>
      <WorkoutDisplay />
      <div className={styles.sidebar}>
        <Timer />
      </div>
    </div>
  );
};

export default WorkoutTracker;
