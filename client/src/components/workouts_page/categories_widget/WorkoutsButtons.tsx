import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../features/store";
import { setFormVisibility } from "../../../features/widgets-actions";
import { setWorkoutState, setWorkoutTitle } from "../../../features/workout";

import styles from "./WorkoutsButton.module.css";

const WorkoutsButton: React.FC = () => {
  const dispatch = useDispatch();

  const { workoutActivity } = useSelector((state: RootState) => {
    return state.workoutState;
  });

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
        style={workoutActivity ? { background: "#e0e0e0" } : {}}
        onClick={startWorkout}
        disabled={workoutActivity}
      >
        Start Empty Workout
      </button>
      <button className={styles["secondary-button"]} onClick={createNewRoutine}>
        New Routine
      </button>
    </div>
  );
};

export default WorkoutsButton;
