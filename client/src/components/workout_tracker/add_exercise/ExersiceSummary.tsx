import React from "react";
import ReactDOM from "react-dom";

import modalStyles from "./AddExerciseForm.module.css";
import styles from "./ExersiceSummary.module.css";
import NextArrowIcon from "../../../assets/svg_icon_components/NextArrowIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import { addExercise, setExerciseVisibility } from "../../../features/workout";

const ExersiceSummary = function () {
  const dispatch = useDispatch();

  const { singleExerciseData } = useSelector((state: RootState) => {
    return state.workoutState;
  });

  const onAddExercise = function () {
    dispatch(addExercise(singleExerciseData));
    onClose();
  };

  const onClose = function () {
    dispatch(setExerciseVisibility(false));
  };

  const preventSumbission = function (
    event: React.FormEvent<HTMLInputElement>
  ) {
    event.preventDefault();
  };

  return (
    <form
      className={modalStyles.modal}
      style={{ paddingBottom: "1.5rem" }}
      onSubmit={() => preventSumbission}
    >
      <header className={styles.header}>
        <nav>
          <button className={styles["back-button"]} onClick={onClose}>
            <NextArrowIcon />
          </button>
          <h4>Summary</h4>
          <button className={styles["add-button"]} onClick={onAddExercise}>
            {" "}
            + Add Exersice
          </button>
        </nav>
        <img src={singleExerciseData.image} />
      </header>
      <main className={styles.main}>
        <h4>{singleExerciseData.name}</h4>
        <h6>
          Primary:{" "}
          {singleExerciseData.primaryMuscles.map((muscle, index) => {
            if (index < singleExerciseData.primaryMuscles.length - 1) {
              return muscle + ", ";
            } else {
              return muscle;
            }
          })}
        </h6>
        <h6>
          Secondary:{" "}
          {singleExerciseData.secondaryMuscles.map((muscle, index) => {
            if (index < singleExerciseData.secondaryMuscles.length - 1) {
              return muscle + ", ";
            } else {
              return muscle;
            }
          })}
        </h6>
        <h5>Guide</h5>
        <ol>
          {singleExerciseData.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </main>
    </form>
  );
};

const ExersiceSummaryModal = function () {
  const overlayRoot = document.getElementById("overlay-root");
  if (!overlayRoot) {
    return null;
  }

  return (
    <React.Fragment>
      {ReactDOM.createPortal(<ExersiceSummary />, overlayRoot)}
    </React.Fragment>
  );
};

export default ExersiceSummaryModal;
