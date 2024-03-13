import ExerciseResult from "./ExerciseResult";
import Header from "./Header";

import React from "react";
import ReactDOM from "react-dom";

import styles from "./AddExerciseForm.module.css";
import { useEffect, useState } from "react";
import { mainAPIPath } from "../../../App";
import {
  Exercise,
  setAddExerciseState,
  setExerciseSummaryVisibility,
  setFilterValue,
} from "../../../features/workout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import { setLoadingState } from "../../../features/loading-actions";
import LoadingSpinner from "../../../assets/svg_icon_components/LoadingSpinner";
import Filter from "./Filter";

export const Backdrop = function () {
  const dispatch = useDispatch();
  const clickHandler = function () {
    dispatch(setAddExerciseState({ visibility: false }));
    dispatch(setExerciseSummaryVisibility(false));
    dispatch(setFilterValue({ equipment: undefined, muscle: undefined }));
  };

  return <div className={styles.backdrop} onClick={clickHandler} />;
};

const AddExerciseForm = function () {
  const [exercisesData, setExercisesData] = useState<Exercise[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);

  const loadingState = useSelector((state: RootState) => {
    return state.loadingManager.isLoading;
  });

  const { searchExercise, filterValue } = useSelector((state: RootState) => {
    return state.workoutState;
  });

  const filterVisibility = useSelector((state: RootState) => {
    return state.workoutState.filterState.visibility;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async function () {
      try {
        dispatch(setLoadingState(true));

        const response = await fetch(`${mainAPIPath}/exercise/get-all`);
        if (response.status === 200) {
          const data = await response.json();
          setExercisesData(data.exercises);
          setErrorMessage(null);
        } else if (response.status === 204) {
          setErrorMessage("No data was found!");
        }
      } catch (error) {
        setErrorMessage("Something went wrong!");
      } finally {
        dispatch(setLoadingState(false));
      }
    };

    const handleRefresh = function () {
      if (refreshTrigger) {
        setRefreshTrigger(false);
        fetchData();
      }
    };

    const handleInitialFetch = function () {
      if (!exercisesData.length) {
        fetchData();
      }
    };

    const handleSearch = function () {
      if (searchExercise) {
        const searchValue = searchExercise.toLowerCase();
        if (
          filteredExercises.length &&
          (filterValue.equipment || filterValue.muscle)
        ) {
          setFilteredExercises((previousState) => {
            return previousState
              .filter((exercise) =>
                exercise.name.toLowerCase().includes(searchValue)
              )
              .concat(
                exercisesData.filter((exercise) =>
                  exercise.primaryMuscles.some((value) =>
                    value.toLowerCase().includes(searchValue)
                  )
                )
              );
          });
        } else {
          const filtered = exercisesData
            .filter((exercise) =>
              exercise.name.toLowerCase().includes(searchValue)
            )
            .concat(
              exercisesData.filter((exercise) =>
                exercise.primaryMuscles.some((value) =>
                  value.toLowerCase().includes(searchValue)
                )
              )
            );
          setFilteredExercises(filtered);
        }
      }
    };

    const handleFiltering = function () {
      const keyEquipment = filterValue.equipment
        ? filterValue.equipment.toLowerCase()
        : "";
      const keyMuscle = filterValue.muscle
        ? filterValue.muscle.toLowerCase()
        : "";
      if (filterValue.equipment || filterValue.muscle) {
        if (filteredExercises.length && searchExercise) {
          setFilteredExercises((previousState) => {
            return previousState.filter(
              (exercise) =>
                (keyEquipment === "" ||
                  exercise.equipment.includes(keyEquipment)) &&
                (keyMuscle === "" ||
                  exercise.primaryMuscles.some((muscle) =>
                    muscle.includes(keyMuscle)
                  ))
            );
          });
        } else {
          const filtered = exercisesData.filter((exercise) => {
            return (
              (keyEquipment === "" ||
                exercise.equipment.includes(keyEquipment)) &&
              (keyMuscle === "" ||
                exercise.primaryMuscles.some((muscle) =>
                  muscle.includes(keyMuscle)
                ))
            );
          });
          setFilteredExercises(filtered);
        }
      }
    };

    handleInitialFetch();
    handleRefresh();
    handleSearch();
    handleFiltering();
  }, [
    setExercisesData,
    setFilteredExercises,
    exercisesData,
    searchExercise,
    refreshTrigger,
    filterValue,
  ]);

  return (
    <div className={styles.modal}>
      <Header />
      <main className={styles.results}>
        {loadingState && (
          <div className={styles["loading-plane"]}>
            <LoadingSpinner />
          </div>
        )}
        {searchExercise || filterValue.equipment || filterValue.muscle ? (
          filteredExercises.length ? (
            filteredExercises.map((data, index) => {
              return <ExerciseResult key={index} exerciseData={data} />;
            })
          ) : (
            <p>No results found</p>
          )
        ) : errorMessage ? (
          <div className={styles["error-wrapper"]}>
            <p>
              {errorMessage}
              <br />
              <span>
                Make sure you are connected to the internet and try again.
              </span>
            </p>
            <button onClick={() => setRefreshTrigger(true)}>Try Again</button>
          </div>
        ) : (
          exercisesData.length > 0 &&
          exercisesData.map((data, index) => {
            return <ExerciseResult key={index} exerciseData={data} />;
          })
        )}
      </main>
      {filterVisibility && <Filter />}
    </div>
  );
};

const AddExercisesModal = function () {
  const formVisibility = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.newRoutine.formVisibility;
  });
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop />,
        formVisibility ? overlayRoot : backdropRoot
      )}
      {ReactDOM.createPortal(<AddExerciseForm />, overlayRoot)}
    </React.Fragment>
  );
};

export default AddExercisesModal;
