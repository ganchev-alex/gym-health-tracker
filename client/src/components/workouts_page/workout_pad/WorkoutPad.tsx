import styles from "./WorkoutPad.module.css";

const WorkoutPad = function () {
  return (
    <div className={styles.widget}>
      <div className={styles.headings}>
        <h5>Arms (Triceps, Biceps & Shoulder)</h5>
        <h6>Workout in progress...</h6>
        <p>Duration: 53:01 minutes</p>
      </div>
      <div className={styles.timer}>
        <button>- 15</button>
        <h6>1:53</h6>
        <button>+ 15</button>
      </div>
    </div>
  );
};

export default WorkoutPad;
