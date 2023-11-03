import styles from "./ExerciseHeader.module.css";

const ExerciseHeader: React.FC = function () {
  return (
    <div className={styles["upper-wrapper"]}>
      <header className={styles["heading-wrapper"]}>
        <div className={styles.details}>
          <img
            src="https://static.strengthlevel.com/images/illustrations/tricep-rope-pushdown-1000x1000.jpg"
            alt="Exercise Image"
          />
          <h3>Lorem ipsum dolor sit amet.</h3>
        </div>
        <button className={styles["settings"]}>
          <span />
          <span />
          <span />
        </button>
      </header>
      <textarea
        placeholder="Add notes here..."
        rows={2}
        maxLength={125}
        className={styles.notes}
      />
      <button className={styles["rest-timer-button"]}>
        Rest Timer: 2 min 45 sec
      </button>
    </div>
  );
};

export default ExerciseHeader;
