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
  restoreRoutinesWidgetInitialState,
  setNotificationState,
  setRoutineOptionsState,
} from "../../../features/widgets-actions";
import ReplaceIcon from "../../../assets/svg_icon_components/ReplaceIcon";
import RemoveIcon from "../../../assets/svg_icon_components/RemoveIcon";
import useInput from "../../../hooks/useInput";
import { getToken } from "../../../util/auth";
import { mainAPIPath } from "../../../App";
import {
  changeChoiceModalVisibility,
  setErrorModalState,
} from "../../../features/modals";
import LoadingPlane from "../../UI/LoadingPlane/LoadingPlane";
import { setLoadingState } from "../../../features/loading-actions";
import {
  Routine,
  setRoutinesData,
  updateRoutinesData,
} from "../../../features/user-actions";
import { fetchRoutines } from "../routines_widget/Routines";
import ChoiceModal from "../../UI/ChoiceModal/ChoiceModal";

const Backdrop = function () {
  const dispatch = useDispatch();
  const clickHandler = function () {
    dispatch(changeChoiceModalVisibility(true));
  };
  return (
    <div
      onClick={clickHandler}
      className={modalStyles.backdrop}
      style={{ zIndex: 4 }}
    />
  );
};

const RoutineForm = function () {
  const dispatch = useDispatch();

  const { mode, title, category, description } = useSelector(
    (state: RootState) => {
      return state.widgetsManager.routinesWidget.routineEditForm;
    }
  );

  const {
    value: routineTitle,
    validationStatus: titleValidationStatus,
    errorState: routineTitleErrorState,
    valueChangeHandler: routineTitleChangeHandler,
    inputBlurHandler: routineTitleBlurHandler,
  } = useInput((value) => value.trim().length > 0, title);

  const {
    value: routineCategory,
    validationStatus: categoryValidationStatus,
    errorState: routineCategoryErrorState,
    valueChangeHandler: routineCategoryChangeHandler,
    inputBlurHandler: routineCategoryBlurHandler,
  } = useInput((value) => value.trim().length > 0, category);

  const [routineDescription, setRoutineDescription] = useState(description);

  const routineExercises = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.newRoutine.exercises;
  });

  const addExerciseVisibility = useSelector((state: RootState) => {
    return state.workoutState.addExerciseState.visibility;
  });

  const exerciseSummaryVisibility = useSelector((state: RootState) => {
    return state.workoutState.exerciseSummaryVisibility;
  });

  const choiceModalVisibility = useSelector((state: RootState) => {
    return state.modalsManager.choiceModal.visibility;
  });

  const routineOptions = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.routineOptions;
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

  const cancel = function () {
    dispatch(changeChoiceModalVisibility(true));
  };

  const onSubmitHandler = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const token = getToken();
    if (!token || token === "TOKEN_EXPIRED") {
      dispatch(
        setErrorModalState({
          visibility: true,
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
      routineId: routineOptions.routineId,
      routineData: {
        title: routineTitle,
        category: routineCategory,
        description: routineDescription,
      },
      routineExercises: routineExercises.map((exercise) => {
        const indexModification = exercise._id.indexOf("-");

        return {
          exercise:
            indexModification > -1
              ? exercise._id.substring(0, indexModification)
              : exercise._id,
          sets: exercise.sets,
          restTime: exercise.restTime || 0,
          notes: exercise.notes || "",
        };
      }),
    };

    if (mode === "ADD") {
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
          const fetchedRoutines = await fetchRoutines();
          if (fetchedRoutines) {
            dispatch(setRoutinesData(fetchedRoutines));
          }
          dispatch(
            setNotificationState({
              message: "🎉 Your routine was added successfully!",
              visibility: true,
            })
          );
          setTimeout(() => {
            dispatch(setNotificationState({ visibility: false }));
          }, 4000);
        } else if (response.status === 422) {
          dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: 422,
              title: "Compromized Validation!",
              details:
                "It seems like you've made a request with invalid data. Please make a new request following the provided steps of the forms you are filling in.",
              label: "Reset",
              redirectionRoute: "/app/workouts",
            })
          );
        } else {
          setNotificationState({
            message: "😢 Something went wrong!",
            visibility: true,
          });
          setTimeout(() => {
            dispatch(setNotificationState({ visibility: false }));
          }, 4000);
        }
      } catch (error) {
        dispatch(
          setErrorModalState({
            visibility: true,
            responseCode: 400,
            title: "Network Error",
            details:
              "It seems like your request didn't go throgh. Please check your internet connection and try again.",
            label: "Ok",
            redirectionRoute: "/app/workouts",
          })
        );
      } finally {
        dispatch(restoreNewRoutineInitState());
        dispatch(setLoadingState(false));
      }
    } else if (mode === "EDIT") {
      try {
        dispatch(setLoadingState(true));

        const response = await fetch(`${mainAPIPath}/app/update-routine`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newRoutineData),
        });

        if (response.status === 201) {
          const data = await response.json();
          const updatedRoutineData: Routine = data.updatedRoutine;
          dispatch(
            updateRoutinesData({
              routineId: updatedRoutineData._id,
              replaceWith: updatedRoutineData,
            })
          );
          dispatch(
            setNotificationState({
              message: "🎉 Routine was updated succesfully!",
              visibility: true,
            })
          );
          setTimeout(() => {
            dispatch(setNotificationState({ visibility: false }));
          }, 4000);
        } else if (response.status === 422) {
          dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: 422,
              title: "Compromized Validation!",
              details:
                "It seems like you've made a request with invalid data. Please make a new request following the provided steps of the forms you are filling in.",
              label: "Reset",
              redirectionRoute: "/app/workouts",
            })
          );
        } else {
          setNotificationState({
            message: "😢 Something went wrong!",
            visibility: true,
          });
          setTimeout(() => {
            dispatch(setNotificationState({ visibility: false }));
          }, 4000);
        }
      } catch (error) {
        dispatch(
          setErrorModalState({
            visibility: true,
            responseCode: 400,
            title: "Network Error",
            details:
              "It seems like your request didn't go throgh. Please check your internet connection and try again.",
            label: "Ok",
            redirectionRoute: "/app/workouts",
          })
        );
      } finally {
        dispatch(setRoutineOptionsState({ visibility: false }));
        dispatch(restoreNewRoutineInitState());
        dispatch(setLoadingState(false));
      }
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className={styles.form}>
      {addExerciseVisibility && <AddExercisesModal />}
      {exerciseSummaryVisibility && <ExersiceSummaryModal />}
      {choiceModalVisibility && (
        <ChoiceModal
          message="Are you sure you want to discard your changes?"
          description="If you procced with this action all changed data will be lost."
          noButtonLable="Back"
          yesButtonLable="Discard"
          acceptAction={() => {
            dispatch(restoreRoutinesWidgetInitialState());
          }}
        />
      )}
      {isLoading && <LoadingPlane />}
      <header className={styles.header}>
        <button type="button" onClick={cancel}>
          Cancel
        </button>
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
          {mode === "ADD" ? "Add Routine" : "Update Routine"}
        </button>
      </section>
      <main className={styles["exercise-wrapper"]}>
        {routineExercises.length ? (
          routineExercises.map((exercise, index) => {
            return (
              <ExerciseSlot
                key={exercise._id}
                exerciseData={exercise}
                index={index}
                staticMode={true}
                sets={exercise.sets}
                restTime={exercise.restTime}
                notes={exercise.notes}
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
