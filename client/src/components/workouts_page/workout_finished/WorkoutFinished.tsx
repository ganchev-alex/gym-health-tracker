import React from "react";
import ReactDOM from "react-dom";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import styles from "./WorkoutFinished.module.css";
import backdropStyle from "../../workout_tracker/add_exercise/AddExerciseForm.module.css";

import medal from "../../../assets/images/medal.png";
import flame from "../../../assets/images/flame.png";
import { changeFinishedWorkoutVisibility } from "../../../features/modals";
import { restoreWorkoutInitialState } from "../../../features/workout";
import { setSessionActivity } from "../../../features/workout-page-actions";

const Backdrop = function () {
  const dispatch = useDispatch();
  return (
    <div
      className={backdropStyle.backdrop}
      onClick={() => {
        dispatch(changeFinishedWorkoutVisibility(false));
      }}
    />
  );
};

const WorkoutFinished = function () {
  const dispatch = useDispatch();
  const { records, number } = useSelector((state: RootState) => {
    return state.modalsManager.workoutFinishedModal.finishedWorkoutData;
  });
  const sessionActivity = useSelector((state: RootState) => {
    return state.widgetsManager.categoriesWidget.sessionActivity;
  });

  return (
    <div className={styles.modal}>
      <h3>{sessionActivity ? "Session" : "Workout"} finished! 🎉</h3>
      <h4>
        Congratulations on finishing your <br />{" "}
        <span>
          <b>
            {number}
            {number % 10 === 1
              ? "st"
              : number % 10 === 2
              ? "nd"
              : number % 10 === 3
              ? "rd"
              : "th"}
          </b>{" "}
          {sessionActivity ? "session" : "workout"}
        </span>
      </h4>
      <img
        alt="Medal and Flame Image"
        src={records.length > 0 ? medal : flame}
      />
      {records.length > 0 && (
        <React.Fragment>
          <h5>New Records!</h5>
          <ul>
            {records.map((record) => (
              <li>
                <b>
                  <span>{record.exercise}: </span>
                  {record.kg} kg.
                </b>
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
      <p>
        Keep up the good work! With each activity you are getting closer to
        achieving your goals and most importantly you are leading a healthier
        and more fulfilled life!
      </p>

      <button
        onClick={() => {
          dispatch(changeFinishedWorkoutVisibility(false));
          dispatch(restoreWorkoutInitialState());
          if (sessionActivity) {
            dispatch(
              setSessionActivity({
                sessionActivity: false,
                selectedActivity: "",
              })
            );
          }
        }}
      >
        Continue
      </button>
    </div>
  );
};

const WorkoutFinishedModal = function () {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");

  if (!backdropRoot || !overlayRoot) {
    return null!;
  }

  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<WorkoutFinished />, overlayRoot)}
    </React.Fragment>
  );
};

export default WorkoutFinishedModal;
