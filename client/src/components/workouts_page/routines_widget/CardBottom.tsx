import React from "react";

import styles from "./CardBottom.module.css";

import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import {
  setWorkoutCategory,
  setWorkoutExercises,
  setWorkoutState,
  setWorkoutTitle,
} from "../../../features/workout";

const CardBottom: React.FC<{
  routineId: string;
  name: string;
  duration: number;
  category: string;
  previewMode?: boolean;
}> = (props) => {
  const hours = Math.floor(props.duration / 3600);
  const minutes = Math.floor((props.duration % 3600) / 60);

  const dispatch = useDispatch();
  const { workoutActivity } = useSelector((state: RootState) => {
    return state.workoutState;
  });
  const routine = useSelector((state: RootState) => {
    return state.userActions.loadedUserData.routines.find(
      (routine) => routine._id === props.routineId
    );
  });

  const onStartRoutine = function (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();
    if (routine) {
      const workoutExercises = routine.exercises.map((exercise) => {
        return {
          ...exercise.exerciseData,
          sets: exercise.sets,
          restTime: exercise.restTime,
          notes: exercise.notes,
          setsData: Array.from({ length: exercise.sets }, () => {
            return { state: false, kg: 0, reps: 0 };
          }),
        };
      });

      dispatch(setWorkoutTitle(props.name));
      dispatch(setWorkoutCategory(props.category));
      dispatch(setWorkoutExercises(workoutExercises));
      dispatch(setWorkoutState({ visibility: true }));
    }
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles["info-wrapper"]}>
        <span className={styles["duration-lable"]}>
          <TimerIcon />
          <p>
            0{hours}:{minutes < 10 ? 0 : ""}
            {minutes}
          </p>
        </span>
        <p>{props.category}</p>
      </span>
      {!props.previewMode ? (
        <button
          className={styles.button}
          onClick={onStartRoutine}
          style={workoutActivity ? { background: "#e0e0e0" } : {}}
          disabled={workoutActivity}
        >
          Start Routine
        </button>
      ) : (
        <p>Volume: </p>
      )}
    </div>
  );
};

export default CardBottom;
