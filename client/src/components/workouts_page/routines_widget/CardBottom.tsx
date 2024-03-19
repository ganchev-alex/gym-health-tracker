import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../features/store";
import {
  setWorkoutCategory,
  setWorkoutExercises,
  setWorkoutState,
  setWorkoutTitle,
} from "../../../features/workout";

import styles from "./CardBottom.module.css";

import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import { setNotificationState } from "../../../features/workout-page-actions";

const CardBottom: React.FC<{
  routineId: string;
  name: string;
  duration: number;
  category: string;
  previewMode?: boolean;
  volume?: number;
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

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const onStartRoutine = async function (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.stopPropagation();

    if (routine) {
      try {
        const response = await fetch(`${mainAPIPath}/exercise/best-sets`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exerciseIds: routine.exercises.map(
              (exercise) => exercise.exerciseData._id
            ),
          }),
        });

        const data: {
          bestSets: {
            exerciseId: string;
            bestSet: {
              exerciseId: string;
              reps: number;
              kg: number;
            };
          }[];
        } = await response.json();

        const workoutExercises = routine.exercises.map((exercise) => {
          const bestSet = { kg: 0, reps: 0 };
          if (data.bestSets) {
            const matchedBestSet = data.bestSets.find(
              (set) => set.exerciseId === exercise.exerciseData._id
            );

            if (matchedBestSet) {
              bestSet.kg = matchedBestSet.bestSet.kg;
              bestSet.reps = matchedBestSet.bestSet.reps;
            }
          }

          return {
            ...exercise.exerciseData,
            sets: exercise.sets,
            restTime: exercise.restTime,
            notes: exercise.notes,
            setsData: Array.from({ length: exercise.sets }, () => {
              return { state: false, kg: 0, reps: 0 };
            }),
            bestSet,
          };
        });

        dispatch(setWorkoutTitle(props.name));
        dispatch(setWorkoutCategory(props.category));
        dispatch(setWorkoutExercises(workoutExercises));
        dispatch(setWorkoutState({ visibility: true }));
      } catch (error) {
        dispatch(
          setNotificationState({
            visibility: true,
            message: "😨 Couldn't start the routine.",
          })
        );

        setTimeout(() => {
          dispatch(setNotificationState({ visibility: false }));
        }, 4000);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles["info-wrapper"]}>
        <span
          className={styles["duration-lable"]}
          style={isMale ? { borderColor: "#472ED8" } : undefined}
        >
          <TimerIcon />
          <p style={isMale ? { color: "#472ED8" } : undefined}>
            0{hours}:{minutes < 10 ? 0 : ""}
            {minutes}
          </p>
        </span>
        <p style={isMale ? { color: "#472ED8" } : undefined}>
          {props.category}
        </p>
      </span>
      {!props.previewMode ? (
        <button
          className={`${
            isMale ? styles["male-button"] : styles["female-button"]
          }`}
          onClick={onStartRoutine}
          style={workoutActivity ? { background: "#e0e0e0" } : {}}
          disabled={workoutActivity}
        >
          Start Routine
        </button>
      ) : (
        <p style={isMale ? { color: "#472ED8" } : undefined}>
          Volume: {props.volume}
        </p>
      )}
    </div>
  );
};

export default CardBottom;
