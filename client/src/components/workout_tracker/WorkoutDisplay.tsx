import ExerciseSlot from "./ExerciseSlot";

import styles from "./WorkoutDisplay.module.css";

const WorkoutDisplay: React.FC = function () {
  return (
    <div className={styles.widget}>
      <div className={styles.display}>
        <ExerciseSlot />
        <ExerciseSlot />
      </div>
    </div>
  );
};

export default WorkoutDisplay;
