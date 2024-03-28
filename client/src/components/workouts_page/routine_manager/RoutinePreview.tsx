import React from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../features/store";

import {
  setNotificationState,
  setRoutinePreviewState,
} from "../../../features/workout-page-actions";
import {
  setWorkoutCategory,
  setWorkoutExercises,
  setWorkoutState,
  setWorkoutTitle,
} from "../../../features/workout";

import ExerciseSlot from "../../workout_tracker/workout_display/ExerciseSlot";

import styles from "./RoutinePreview.module.css";
import formInheritedStyles from "./RoutineForm.module.css";
import modalStyles from "../../workout_tracker/add_exercise/AddExerciseForm.module.css";

import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";
import { getToken } from "../../../util/auth";
import { mainAPIPath } from "../../../App";

const Backdrop = function () {
  const dispatch = useDispatch();
  const clickHandler = function () {
    dispatch(setRoutinePreviewState({ visibility: false }));
  };
  return (
    <div
      onClick={clickHandler}
      className={modalStyles.backdrop}
      style={{ zIndex: 4 }}
    />
  );
};

const RoutinePreview = function () {
  const dispatch = useDispatch();

  const { workoutActivity } = useSelector(
    (state: RootState) => state.workoutState
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const routineData = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.routinePreviewForm.routineData;
  });

  const onStartRoutine = async function () {
    if (routineData) {
      try {
        const response = await fetch(`${mainAPIPath}/exercise/best-sets`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exerciseIds: routineData.exercises.map(
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

        const workoutExercises = routineData.exercises.map((exercise) => {
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

        dispatch(setWorkoutTitle(routineData?.title));
        dispatch(setWorkoutCategory(routineData.category));
        dispatch(setWorkoutExercises(workoutExercises));
        dispatch(setWorkoutState({ visibility: true }));
        dispatch(setRoutinePreviewState({ visibility: false }));
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

  const onClose = function () {
    dispatch(setRoutinePreviewState({ visibility: false }));
  };

  if (!routineData) {
    dispatch(
      setNotificationState({
        visibility: true,
        message: "😓 Routine couldn't be loaded.",
      })
    );

    setTimeout(() => {
      dispatch(setNotificationState({ visibility: false }));
    }, 4000);

    return null;
  }

  const routineExercises = routineData.exercises;
  const hours = Math.floor(routineData.duration / 3600);
  const minutes = Math.floor((routineData.duration % 3600) / 60);

  return (
    <div className={formInheritedStyles.form}>
      <header
        className={`${formInheritedStyles.header} ${
          isMale ? formInheritedStyles.male : formInheritedStyles.female
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          style={isMale ? { color: "#472ED8" } : undefined}
        >
          Close
        </button>
        <h6>Routine Preview</h6>
      </header>
      <section className={styles.details}>
        <h3>{routineData.title}</h3>
        <p>{routineData.description}</p>
        <span className={styles.characteristics}>
          <p
            style={
              isMale ? { color: "#472ed8", borderColor: "#472ed8" } : undefined
            }
          >
            <TimerIcon /> {0}
            {hours}:{minutes < 10 ? 0 : ""}
            {minutes} hours
          </p>
          <p style={isMale ? { color: "#472ed8" } : undefined}>
            {routineData.category}
          </p>
        </span>
      </section>
      <button
        type="button"
        className={`${formInheritedStyles["submit-button"]} ${
          isMale
            ? formInheritedStyles["male-button"]
            : formInheritedStyles["female-button"]
        }`}
        onClick={onStartRoutine}
        disabled={workoutActivity}
        style={workoutActivity ? { background: "#e0e0e0" } : {}}
      >
        Start Routine
      </button>
      <main className={formInheritedStyles["exercise-wrapper"]}>
        {routineExercises.map((exercise) => {
          return (
            <ExerciseSlot
              exerciseData={exercise.exerciseData}
              key={exercise.exerciseData._id}
              sets={exercise.sets}
              restTime={exercise.restTime}
              notes={exercise.notes}
              staticMode={true}
              previewMode={true}
            />
          );
        })}
      </main>
    </div>
  );
};

const RoutinePreviewModal = function () {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<RoutinePreview />, overlayRoot)}
    </React.Fragment>
  );
};

export default RoutinePreviewModal;
