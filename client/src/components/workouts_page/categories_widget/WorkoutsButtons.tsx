import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../features/store";
import { setFormVisibility } from "../../../features/workout-page-actions";
import { setWorkoutState, setWorkoutTitle } from "../../../features/workout";

import styles from "./WorkoutsButton.module.css";

const WorkoutsButton: React.FC = () => {
  const dispatch = useDispatch();

  const { workoutActivity } = useSelector((state: RootState) => {
    return state.workoutState;
  });

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const createNewRoutine = function () {
    dispatch(setFormVisibility(true));
  };

  const startWorkout = function () {
    dispatch(setWorkoutTitle());
    dispatch(setWorkoutState({ visibility: true }));
  };

  return (
    <div className={styles["button-holder"]}>
      <button
        className={styles["main-button"]}
        style={
          workoutActivity
            ? { background: "#e0e0e0" }
            : isMale
            ? { backgroundImage: "linear-gradient(90deg, #29156b, #472ED8)" }
            : undefined
        }
        onClick={startWorkout}
        disabled={workoutActivity}
      >
        Start Empty Workout
      </button>
      <button
        className={`${isMale ? styles.male : styles.female} ${
          styles["secondary-button"]
        }`}
        onClick={createNewRoutine}
      >
        New Routine
      </button>
    </div>
  );
};

export default WorkoutsButton;
