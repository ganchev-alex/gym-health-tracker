import React, { useEffect, useState } from "react";

import CardsHolder from "./CardsHolder";
import CategoriesFilter from "./CategoriesFilter";

import styles from "./Routines.module.css";
import buttonStyle from "../categories_widget/WorkoutsButton.module.css";
import optionsStyle from "../../workout_tracker/workout_display/WorkoutDisplay.module.css";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import {
  setEditFormData,
  setFormVisibility,
  setNotificationState,
  setRoutineOptionsState,
} from "../../../features/workout-page-actions";
import RemoveIcon from "../../../assets/svg_icon_components/RemoveIcon";
import EditIcon from "../../../assets/svg_icon_components/EditIcon";
import ChoiceModal from "../../UI/ChoiceModal/ChoiceModal";
import { changeChoiceModalVisibility } from "../../../features/modals";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import { setRoutinesData } from "../../../features/user-actions";
import RoutinePreviewModal from "../routine_manager/RoutinePreview";

const Routines: React.FC = () => {
  const dispatch = useDispatch();
  const routines = useSelector((state: RootState) => {
    return state.userActions.loadedUserData.routines;
  });

  const optionsState = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.routineOptions;
  });

  const modalVisibilitity = useSelector((state: RootState) => {
    return state.modalsManager.choiceModal.visibility;
  });

  const routinePreviewVisibility = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.routinePreviewForm.visibility;
  });

  const categories = routines.map((routine) => {
    return routine.category;
  });

  const closeOptions = function () {
    dispatch(setRoutineOptionsState({ visibility: false }));
  };

  const editRoutine = function () {
    const routine = routines.find((routine) => {
      return routine._id === optionsState.routineId;
    });

    if (routine) {
      dispatch(
        setEditFormData({
          fieldData: { mode: "EDIT", ...routine },
          exercises: routine.exercises.map((exercise) => {
            return {
              ...exercise.exerciseData,
              sets: exercise.sets,
              restTime: exercise.restTime,
              notes: exercise.notes,
            };
          }),
        })
      );
      dispatch(setFormVisibility(true));
    }
  };

  const deleteRoutine = async function () {
    const response = await fetch(`${mainAPIPath}/app/delete-routine`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        routineId: optionsState.routineId,
      }),
    });

    const fetchedRoutines = await fetchRoutines();
    if (fetchedRoutines) {
      dispatch(setRoutinesData(fetchedRoutines));
    }

    if (response.ok) {
      dispatch(
        setNotificationState({
          message: "🗑️ Routine deleted succesfully",
          visibility: true,
        })
      );
    } else {
      dispatch(
        setNotificationState({
          message: "🤷🏻 Something went wrong",
          visibility: true,
        })
      );
    }

    setTimeout(() => {
      dispatch(
        setNotificationState({
          visibility: false,
        })
      );
    }, 4000);
  };

  const onNewRoutine = function () {
    dispatch(setFormVisibility(true));
  };

  return (
    <React.Fragment>
      {modalVisibilitity && (
        <ChoiceModal
          message="Are you sure you want to delete this routine?"
          description={`By saying yes you will delete "${
            routines.find((routine) => {
              return routine._id === optionsState.routineId;
            })?.title
          }" peremenatly and you won't be able to restore it.`}
          noButtonLable="Cancel"
          yesButtonLable="Delete"
          acceptAction={deleteRoutine}
        />
      )}
      {routinePreviewVisibility && <RoutinePreviewModal />}
      <div className={styles.widget}>
        <h6 className={styles.header}>My Routines</h6>
        <p className={styles.comment}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit iusto
          nulla, distinctio eligendi eveniet delectus.
        </p>
        {routines.length > 0 ? (
          <React.Fragment>
            <CategoriesFilter categories={categories} />
            <CardsHolder />
          </React.Fragment>
        ) : (
          <div className={styles["message-container"]}>
            <h6>No Routines!</h6>
            <p>
              You don't have any saved routines! If you want to add one click on
              the button "New Routine" and layout your routine.
            </p>
            <button
              type="button"
              className={buttonStyle["secondary-button"]}
              onClick={onNewRoutine}
            >
              New Routine
            </button>
          </div>
        )}
        {optionsState.visibility && (
          <div className={optionsStyle["exercise-menu"]} onClick={closeOptions}>
            <div className={optionsStyle["options"]}>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  editRoutine();
                }}
              >
                <EditIcon />
                Edit Routine
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch(changeChoiceModalVisibility(true));
                }}
              >
                <RemoveIcon /> Remove Routine
              </button>
            </div>
            <button
              type="button"
              className={optionsStyle["close-button"]}
              onClick={closeOptions}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Routines;
export const fetchRoutines = async function () {
  try {
    const response = await fetch(`${mainAPIPath}/app/routines`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.routines;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
