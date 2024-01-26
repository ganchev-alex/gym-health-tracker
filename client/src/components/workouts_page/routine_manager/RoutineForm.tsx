import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import AddExercisesModal from "../../workout_tracker/add_exercise/AddExerciseForm";
import ExersiceSummaryModal from "../../workout_tracker/add_exercise/ExersiceSummary";
import ExerciseSlot from "../../workout_tracker/workout_display/ExerciseSlot";

import styles from "./RoutineForm.module.css";
import inheritedStyles from "../../workout_tracker/workout_display/WorkoutDisplay.module.css";
import modalStyles from "../../workout_tracker/add_exercise/AddExerciseForm.module.css";
import {
  setAddExerciseState,
  setOptionsMenuState,
} from "../../../features/workout";
import { useEffect } from "react";
import {
  removeFromNewRoutine,
  restoreNewRoutineInitState,
  setFormVisibility,
  setNotificationState,
} from "../../../features/widgets-actions";
import ReplaceIcon from "../../../assets/svg_icon_components/ReplaceIcon";
import RemoveIcon from "../../../assets/svg_icon_components/RemoveIcon";
import useInput from "../../../hooks/useInput";
import { getToken } from "../../../util/auth";
import ErrorModal from "../../UI/ErrorModal/ErrorModal";
import { mainAPIPath } from "../../../App";
import {
  changeVisibility,
  setModuleData,
} from "../../../features/error-module";
import LoadingPlane from "../../UI/LoadingPlane/LoadingPlane";
import { setLoadingState } from "../../../features/loading-actions";

const Backdrop = function () {
  const dispatch = useDispatch();
  const clickHandler = function () {
    dispatch(setFormVisibility(false));
  };
  return <div onClick={clickHandler} className={modalStyles.backdrop} />;
};

const RoutineForm = function () {
  const dispatch = useDispatch();

  const {
    value: routineTitle,
    validationStatus: titleValidationStatus,
    errorState: routineTitleErrorState,
    valueChangeHandler: routineTitleChangeHandler,
    inputBlurHandler: routineTitleBlurHandler,
  } = useInput((value) => value.trim().length > 0);

  const {
    value: routineCategory,
    validationStatus: categoryValidationStatus,
    errorState: routineCategoryErrorState,
    valueChangeHandler: routineCategoryChangeHandler,
    inputBlurHandler: routineCategoryBlurHandler,
  } = useInput((value) => value.trim().length > 0);

  const [routineDescription, setRoutineDescription] = useState("");

  const { isShown, moduleData } = useSelector((state: RootState) => {
    return state.errorModuleManager;
  });

  const addExerciseVisibility = useSelector((state: RootState) => {
    return state.workoutState.addExerciseState.visibility;
  });

  const exerciseSummaryVisibility = useSelector((state: RootState) => {
    return state.workoutState.exerciseSummaryVisibility;
  });

  const routineExercises = useSelector((state: RootState) => {
    return state.widgetsManager.workoutWidget.newRoutine.exercises;
  });

  const optionsMenuState = useSelector((state: RootState) => {
    return state.workoutState.optionsMenuState;
  });

  const isLoading = useSelector((state: RootState) => {
    return state.loadingManager.isLoading;
  });

  useEffect(() => {}, [
    routineExercises,
    routineTitleErrorState,
    routineCategoryErrorState,
  ]);

  const clickHandler = function () {
    dispatch(setAddExerciseState({ visibility: true, mode: "ADD_ROUTINE" }));
  };

  const closeOptions = function () {
    dispatch(setOptionsMenuState({ visibility: false }));
  };

  const replace = function (event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    dispatch(
      setAddExerciseState({ visibility: true, mode: "REPLACE_ROUTINE" })
    );
  };

  const remove = function () {
    dispatch(removeFromNewRoutine(optionsMenuState.exerciseId || ""));
  };

  const close = function () {
    dispatch(restoreNewRoutineInitState());
    dispatch(setFormVisibility(false));
  };

  const onSubmitHandler = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = getToken();
    if (!token || token === "TOKEN_EXPIRED") {
      dispatch(changeVisibility(true));
      dispatch(
        setModuleData({
          responseCode: 403,
          title: "Failed Authentication.",
          details:
            "It seems like your authentication token is missing. Try loging in again and if you continue to encounter this problem reach out to us!",
          label: "Log In",
          redirectionRoute: "/auth/login",
        })
      );
      return;
    }

    const newRoutineData = {
      routineData: {
        title: routineTitle,
        category: routineCategory,
        description: routineDescription,
      },
      routineExercises: routineExercises.map((exercise) => {
        const indexModification = exercise._id.indexOf("-");
        if (indexModification > -1) {
          return {
            exerciseId: exercise._id.substring(0, indexModification),
            sets: exercise.sets,
          };
        }
        return {
          exerciseId: exercise._id,
          sets: exercise.sets,
          restTime: exercise.restTime ? exercise.restTime : 0,
        };
      }),
    };

    try {
      dispatch(setLoadingState(true));
      const response = await fetch(`${mainAPIPath}/app/new-routine`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRoutineData),
      });

      if (response.status === 201) {
        dispatch(
          setNotificationState({
            message: "🎉 Your routine was added successfully!",
            visibility: true,
          })
        );
        dispatch(restoreNewRoutineInitState());
      } else if (response.status === 401) {
        dispatch(
          setModuleData({
            responseCode: 401,
            title: "Not Aunthenticated!",
            details:
              "It seems like you tried to access a route that requires authentication. Please log in and try again.",
            label: "Log in",
            redirectionRoute: "/auth/login",
          })
        );
        dispatch(changeVisibility(true));
      } else if (response.status === 404) {
        dispatch(
          setModuleData({
            responseCode: 404,
            title: "User not found.",
            details:
              "It seems like there is problem with sending your data. Please log in and try again. If you continue to encounter this issue reach out.",
            label: "Log in",
            redirectionRoute: "/auth/login",
          })
        );
        dispatch(changeVisibility(true));
      } else if (response.status === 422) {
        dispatch(
          setModuleData({
            responseCode: 422,
            title: "Compromized Validation!",
            details:
              "It seems like you've made a request with invalid data. Please make a new request following the provided steps of the forms you are filling in.",
            label: "Reset",
            redirectionRoute: "/app/workouts",
          })
        );
        dispatch(changeVisibility(true));
      } else if (response.status === 500) {
        setNotificationState({
          message: "😢 Something went wrong!",
          visibility: true,
        });
        dispatch(restoreNewRoutineInitState());
      }
    } catch (error) {
      dispatch(changeVisibility(true));
      dispatch(
        setModuleData({
          responseCode: 400,
          title: "Network Error",
          details:
            "It seems like your request didn't go throgh. Please check your internet connection and try again.",
          label: "Ok",
          redirectionRoute: "/app/workouts",
        })
      );
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className={styles.form}>
      {addExerciseVisibility && <AddExercisesModal />}
      {exerciseSummaryVisibility && <ExersiceSummaryModal />}
      {isShown && <ErrorModal properties={moduleData} />}
      {isLoading && <LoadingPlane />}
      <header className={styles.header}>
        <button onClick={close}>Cancel</button>
        <h6>New Routine</h6>
      </header>
      <section className={styles.details}>
        <div>
          <input
            type="text"
            id="routineTitle"
            name="routineTitle"
            value={routineTitle}
            onChange={routineTitleChangeHandler}
            onBlur={routineTitleBlurHandler}
            placeholder={`${routineTitleErrorState ? "*" : ""} Routine Title ${
              routineTitleErrorState ? "must be included!" : ""
            }`}
            maxLength={50}
            style={
              routineTitleErrorState
                ? { color: "#d90429", fontWeight: 700 }
                : {}
            }
          />
          <input
            type="text"
            id="category"
            name="category"
            value={routineCategory}
            onChange={routineCategoryChangeHandler}
            onBlur={routineCategoryBlurHandler}
            placeholder={`${routineCategoryErrorState ? "*" : ""} Category`}
            maxLength={30}
            style={
              routineCategoryErrorState ? { backgroundColor: "#d90429" } : {}
            }
          />
        </div>
        <textarea
          placeholder="(Optional) Add description here..."
          rows={2}
          maxLength={125}
          value={routineDescription}
          onChange={(e) => {
            setRoutineDescription(e.target.value);
          }}
        />
        <button
          type="submit"
          className={styles["submit-button"]}
          style={
            !(
              titleValidationStatus &&
              categoryValidationStatus &&
              routineExercises.length > 0
            )
              ? { background: "#e0e0e0" }
              : {}
          }
          disabled={
            !(
              titleValidationStatus &&
              categoryValidationStatus &&
              routineExercises.length > 0
            )
          }
        >
          Save Routine
        </button>
      </section>
      <main className={styles["exercise-wrapper"]}>
        {routineExercises.length ? (
          routineExercises.map((exercise) => {
            return (
              <ExerciseSlot
                exerciseData={exercise}
                key={exercise._id}
                staticMode={true}
              />
            );
          })
        ) : (
          <div className={inheritedStyles["start-message"]}>
            <h4>Create your routine!</h4>
            <p>Add exercises to the routine.</p>
          </div>
        )}
        <button
          className={inheritedStyles["add-button"]}
          type="button"
          onClick={clickHandler}
        >
          + Add Exercise
        </button>
        {optionsMenuState.visibility && (
          <div
            className={inheritedStyles["exercise-menu"]}
            onClick={closeOptions}
          >
            <div className={inheritedStyles["options"]}>
              <button type="button" onClick={replace}>
                <ReplaceIcon /> Replace Exercise
              </button>
              <button type="button" onClick={remove}>
                <RemoveIcon />
                Remove Exercise
              </button>
            </div>
            <button
              type="button"
              className={inheritedStyles["close-button"]}
              onClick={closeOptions}
            >
              Close
            </button>
          </div>
        )}
      </main>
    </form>
  );
};

const RoutineModal = function () {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<RoutineForm />, overlayRoot)}
    </React.Fragment>
  );
};

export default RoutineModal;
