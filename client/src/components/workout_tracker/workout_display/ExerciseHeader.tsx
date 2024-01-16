import { useDispatch } from "react-redux";
import styles from "./ExerciseHeader.module.css";
import {
  Exercise,
  setExerciseData,
  setExerciseSummaryVisibility,
  setOptionsMenuState,
} from "../../../features/workout";

const ExerciseHeader: React.FC<{
  exerciseData: Exercise;
}> = function (props) {
  const dispatch = useDispatch();

  const { exerciseData } = props;

  const loadExeriseMenu = function () {
    dispatch(
      setOptionsMenuState({ visibility: true, exerciseId: exerciseData._id })
    );
  };

  const showSummary = function () {
    dispatch(setExerciseSummaryVisibility(true));
    dispatch(setExerciseData(exerciseData));
  };

  return (
    <div className={styles["upper-wrapper"]}>
      <header className={styles["heading-wrapper"]}>
        <input type="hidden" value={exerciseData._id} />
        <div className={styles.details} onClick={showSummary}>
          <img src={exerciseData.image} alt="Exercise Image" />
          <h3>{exerciseData.name}</h3>
        </div>
        <button className={styles["settings"]} onClick={loadExeriseMenu}>
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
