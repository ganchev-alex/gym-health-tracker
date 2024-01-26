import { useDispatch, useSelector } from "react-redux";
import ExerciseSlot from "./ExerciseSlot";

import styles from "./WorkoutDisplay.module.css";
import { RootState } from "../../../features/store";
import AddExercisesModal from "../add_exercise/AddExerciseForm";
import {
  removeExercise,
  setAddExerciseState,
  setOptionsMenuState,
} from "../../../features/workout";
import { useEffect } from "react";
import ReplaceIcon from "../../../assets/svg_icon_components/ReplaceIcon";
import RemoveIcon from "../../../assets/svg_icon_components/RemoveIcon";
import ExersiceSummaryModal from "../add_exercise/ExersiceSummary";

const WorkoutDisplay: React.FC = function () {
  const {
    exercises,
    addExerciseState,
    optionsMenuState,
    exerciseSummaryVisibility,
  } = useSelector((state: RootState) => {
    return state.workoutState;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(exercises);
    console.log(optionsMenuState);
  }, [exercises, optionsMenuState]);

  const clickHandler = function () {
    dispatch(setAddExerciseState({ visibility: true, mode: "ADD" }));
  };

  const closeOptions = function () {
    dispatch(setOptionsMenuState({ visibility: false }));
  };

  const replace = function (event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    console.log("Replace Activated: ", optionsMenuState);
    dispatch(setAddExerciseState({ visibility: true, mode: "REPLACE" }));
  };

  const remove = function () {
    dispatch(removeExercise(optionsMenuState.exerciseId || ""));
  };

  return (
    <div className={styles.widget}>
      {addExerciseState.visibility && <AddExercisesModal />}
      {exerciseSummaryVisibility && <ExersiceSummaryModal />}
      <div className={styles.display}>
        {exercises.length ? (
          exercises.map((exercise) => {
            return <ExerciseSlot exerciseData={exercise} key={exercise._id} />;
          })
        ) : (
          <div className={styles["start-message"]}>
            <h4>Get Started!</h4>
            <p>Add an exercise to start your workout.</p>
          </div>
        )}
        <button
          type="button"
          className={styles["add-button"]}
          onClick={clickHandler}
        >
          + Add Exercise
        </button>
      </div>
      {optionsMenuState.visibility && (
        <div className={styles["exercise-menu"]} onClick={closeOptions}>
          <div className={styles["options"]}>
            <button type="button" onClick={replace}>
              <ReplaceIcon /> Replace Exercise
            </button>
            <button type="button" onClick={remove}>
              <RemoveIcon />
              Remove Exercise
            </button>
          </div>
          <button
            type="button"
            className={styles["close-button"]}
            onClick={closeOptions}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutDisplay;
