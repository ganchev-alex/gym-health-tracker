import React from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../features/store";

import styles from "./RoutinePreview.module.css";
import formInheritedStyles from "./RoutineForm.module.css";
import modalStyles from "../../workout_tracker/add_exercise/AddExerciseForm.module.css";
import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";
import {
  setNotificationState,
  setRoutinePreviewState,
} from "../../../features/widgets-actions";
import ExerciseSlot from "../../workout_tracker/workout_display/ExerciseSlot";

const Backdrop = function () {
  const dispatch = useDispatch();
  const clickHandler = function () {
    dispatch(setRoutinePreviewState({ visibility: false }));
  };
  return <div onClick={clickHandler} className={modalStyles.backdrop} />;
};

const RoutinePreview = function () {
  const dispatch = useDispatch();
  const routineData = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.routinePreviewForm.routineData;
  });

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
      <header className={formInheritedStyles.header}>
        <button type="button" onClick={onClose}>
          Close
        </button>
        <h6>Routine Preview</h6>
      </header>
      <section className={styles.details}>
        <h3>{routineData.title}</h3>
        <p>{routineData.description}</p>
        <span className={styles.characteristics}>
          <p>
            <TimerIcon /> {0}
            {hours}:{minutes < 10 ? 0 : ""}
            {minutes} hours
          </p>
          <p>{routineData.category}</p>
        </span>
      </section>
      <button type="button" className={formInheritedStyles["submit-button"]}>
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
