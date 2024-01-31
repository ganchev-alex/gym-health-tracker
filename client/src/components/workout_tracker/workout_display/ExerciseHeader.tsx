import { useDispatch, useSelector } from "react-redux";
import styles from "./ExerciseHeader.module.css";
import {
  Exercise,
  setExerciseData,
  setExerciseSummaryVisibility,
  setOptionsMenuState,
  setRestTime,
  setExerciseNotes,
} from "../../../features/workout";
import {
  setResetTimerRoutine,
  setRoutineNotes,
} from "../../../features/widgets-actions";
import { useEffect, useState } from "react";

const ExerciseHeader: React.FC<{
  exerciseData: Exercise;
  index?: number;
  restTime?: number;
  notes?: string;
  staticMode?: boolean;
  previewMode?: boolean;
}> = function (props) {
  const dispatch = useDispatch();

  const { exerciseData } = props;
  const [notes, setNotes] = useState(props.notes || "");

  const onTimerSelect = function (e: React.ChangeEvent<HTMLSelectElement>) {
    if (props.staticMode) {
      dispatch(
        setResetTimerRoutine({ id: exerciseData._id, time: +e.target.value })
      );
    } else {
      dispatch(setRestTime({ id: exerciseData._id, time: +e.target.value }));
    }
  };

  useEffect(() => {
    const notesUpdateManager = setTimeout(() => {
      if (props.index != undefined) {
        if (!props.staticMode) {
          dispatch(setExerciseNotes({ exerciseIndex: props.index, notes }));
        } else {
          dispatch(setRoutineNotes({ exerciseIndex: props.index, notes }));
        }
      }
    }, 500);

    return () => clearTimeout(notesUpdateManager);
  }, [notes, dispatch]);

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
        <div
          className={styles.details}
          onClick={!props.previewMode ? showSummary : () => {}}
          style={props.previewMode ? { cursor: "default" } : {}}
        >
          <img src={exerciseData.image} alt="Exercise Image" />
          <h3>{exerciseData.name}</h3>
        </div>
        {!props.previewMode && (
          <button
            type="button"
            className={styles["settings"]}
            onClick={loadExeriseMenu}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </header>
      <textarea
        placeholder={"Add notes here..."}
        rows={2}
        maxLength={225}
        className={styles.notes}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={props.previewMode}
      />
      <span className={styles["rest-timer"]}>
        <label htmlFor="restTime">Rest Time:</label>
        <select
          name="restTime"
          id="restTime"
          onChange={onTimerSelect}
          value={props.restTime}
          disabled={props.previewMode}
        >
          <option value={0} defaultValue={0}>
            Off.
          </option>
          <option value={5}>5 s.</option>
          <option value={10}>10 s.</option>
          <option value={15}>15 s.</option>
          <option value={20}>20 s.</option>
          <option value={25}>25 s.</option>
          <option value={30}>30 s.</option>
          <option value={45}>45 s.</option>
          <option value={60}>1 min.</option>
          <option value={75}>1 min. 15 s.</option>
          <option value={90}>1 min. 30 s.</option>
          <option value={105}>1 min. 45 s.</option>
          <option value={120}>2 min.</option>
          <option value={135}>2 min. 15 s.</option>
          <option value={150}>2 min. 30 s.</option>
          <option value={165}>2 min. 45 s.</option>
          <option value={180}>3 min.</option>
          <option value={195}>3 min. 15 s.</option>
          <option value={210}>3 min. 30 s.</option>
          <option value={225}>3 min. 45 s.</option>
          <option value={240}>4 min.</option>
          <option value={255}>4 min. 15 s.</option>
          <option value={270}>4 min. 30 s.</option>
          <option value={285}>4 min. 45 s.</option>
          <option value={300}>5 min.</option>
        </select>
      </span>
    </div>
  );
};

export default ExerciseHeader;
