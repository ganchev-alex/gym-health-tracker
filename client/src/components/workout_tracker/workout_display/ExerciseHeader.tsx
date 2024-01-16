import styles from "./ExerciseHeader.module.css";

const ExerciseHeader: React.FC<{ _id: string; name: string; img: string }> =
  function (props) {
    return (
      <div className={styles["upper-wrapper"]}>
        <header className={styles["heading-wrapper"]}>
          <input type="hidden" value={props._id} />
          <div className={styles.details}>
            <img src={props.img} alt="Exercise Image" />
            <h3>{props.name}</h3>
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
