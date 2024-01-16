import { useDispatch, useSelector } from "react-redux";
import ExerciseSlot from "./ExerciseSlot";

import styles from "./WorkoutDisplay.module.css";
import { RootState } from "../../../features/store";
import AddExercisesModal from "../add_exercise/AddExerciseForm";
import { setAddExerciseVisibility } from "../../../features/workout";
import { useEffect } from "react";

const WorkoutDisplay: React.FC = function () {
  const { exercises, addExerciseVisibility } = useSelector(
    (state: RootState) => {
      return state.workoutState;
    }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(exercises);
  }, [exercises]);

  const clickHandler = function () {
    dispatch(setAddExerciseVisibility(true));
  };

  return (
    <div className={styles.widget}>
      {addExerciseVisibility && <AddExercisesModal />}
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
        <button className={styles["add-button"]} onClick={clickHandler}>
          + Add Exercise
        </button>
      </div>
      <div>{/* Exercise Settings opened from the exercise itself */}</div>
    </div>
  );
};

export default WorkoutDisplay;
