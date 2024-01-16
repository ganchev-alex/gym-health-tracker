import React from "react";
import ReactDOM from "react-dom";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import {
  addExercise,
  replaceExercise,
  setAddExerciseState,
  setExerciseSummaryVisibility,
  setOptionsMenuState,
} from "../../../features/workout";

import { Backdrop } from "./AddExerciseForm";

import modalStyles from "./AddExerciseForm.module.css";
import styles from "./ExersiceSummary.module.css";

import NextArrowIcon from "../../../assets/svg_icon_components/NextArrowIcon";

const ExersiceSummary = function () {
  const dispatch = useDispatch();

  const { singleExerciseData, addExerciseState, optionsMenuState } =
    useSelector((state: RootState) => {
      return state.workoutState;
    });

  const onAddExercise = function () {
    if (addExerciseState.mode === "ADD" || !addExerciseState.mode) {
      dispatch(addExercise(singleExerciseData));
    } else if (addExerciseState.mode === "REPLACE") {
      console.log("Replaced Exercise: ", optionsMenuState.exerciseId);
      dispatch(
        replaceExercise({
          currant: optionsMenuState.exerciseId || "",
          replaceWith: singleExerciseData,
        })
      );
      dispatch(setOptionsMenuState({ visibility: false }));
      dispatch(setAddExerciseState({ visibility: false }));
    }

    onClose();
  };

  const onClose = function () {
    dispatch(setExerciseSummaryVisibility(false));
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
          <button
            className={styles["add-button"]}
            style={{
              display: `${addExerciseState.visibility ? "block" : "none"}`,
            }}
            onClick={onAddExercise}
          >
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
  const { addExerciseState } = useSelector((state: RootState) => {
    return state.workoutState;
  });

  const overlayRoot = document.getElementById("overlay-root");
  const backdropRoot = document.getElementById("backdrop-root");
  if (!overlayRoot || !backdropRoot) {
    return null;
  }

  return (
    <React.Fragment>
      {!addExerciseState.visibility &&
        ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<ExersiceSummary />, overlayRoot)}
    </React.Fragment>
  );
};

export default ExersiceSummaryModal;
