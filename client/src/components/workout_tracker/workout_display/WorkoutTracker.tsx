import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Timer from "./Timer";
import WorkoutDisplay from "./WorkoutDisplay";

import styles from "./WorkoutTracker.module.css";
import {
  changeChoiceModalVisibility,
  changeFinishedWorkoutVisibility,
  setErrorModalState,
} from "../../../features/modals";
import store, { RootState } from "../../../features/store";
import ChoiceModal from "../../UI/ChoiceModal/ChoiceModal";
import {
  finishedWorkoutData,
  restoreWorkoutInitialState,
  setWorkoutState,
} from "../../../features/workout";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import { setNotificationState } from "../../../features/widgets-actions";
import { useNavigate } from "react-router-dom";

const WorkoutTracker: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalMode, setModalMode] = useState(false);
  const [modalData, setModalData] = useState({
    message: "",
    description: "",
    noButtonLable: "",
    yesButtonLable: "",
    acceptAction: () => {},
  });

  const workoutState = useSelector((state: RootState) => state.workoutState);

  const modalVisibility = useSelector(
    (state: RootState) => state.modalsManager.choiceModal.visibility
  );

  useEffect(() => {
    const newModalData = modalMode
      ? {
          message: "Workout still in progress!",
          description:
            "Are you sure you want to submit your workout? There are still sets that are not completed.",
          noButtonLable: "Cancel",
          yesButtonLable: "Submit",
          acceptAction: submitWorkout,
        }
      : {
          message: "Are you sure you want to discard your workout?",
          description:
            "This action is irreversible and all of your progress will be lost.",
          noButtonLable: "Cancel",
          yesButtonLable: "Discard",
          acceptAction: () => {
            dispatch(restoreWorkoutInitialState());
          },
        };
    setModalData(newModalData);
  }, [modalMode]);

  const onDiscardWorkout = function () {
    dispatch(changeChoiceModalVisibility(true));
  };

  const proccedWorkoutSubmission = async function () {
    const setsChecker = workoutState.exercises.every((exercise) => {
      if (exercise.setsData) {
        return exercise.setsData.every((set) => set.state === true);
      }

      return false;
    });

    if (setsChecker) {
      await submitWorkout();
    } else {
      setModalMode(true);
      dispatch(changeChoiceModalVisibility(true));
    }
  };

  const submitWorkout = async function () {
    const workoutData = {
      date: new Date(),
      title: workoutState.workoutTitle,
      category: workoutState.workoutCategory,
      exercises: workoutState.exercises
        .map((exercise) => {
          const indexModification = exercise._id.indexOf("-");
          return {
            exerciseId:
              indexModification > -1
                ? exercise._id.substring(0, indexModification)
                : exercise._id,
            name: exercise.name,
            sets: exercise.setsData
              ?.filter((set) => set.state)
              .map((set) => {
                if (set.state) {
                  return {
                    reps: set.reps,
                    kg: set.kg,
                  };
                }
              }),
            notes: exercise.notes,
          };
        })
        .filter((exercise) => exercise.sets && exercise.sets?.length > 0),
      duration: workoutState.duration,
      volume: workoutState.totalVolume,
      sets: workoutState.totalSets,
    };

    try {
      const response = await fetch(`${mainAPIPath}/app/save-workout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(workoutData),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          newRecords: { exercise: string; kg: number }[];
          workoutNumber: number;
        };
        console.log("Response data: ", data);
        dispatch(
          finishedWorkoutData({
            records: data.newRecords,
            number: data.workoutNumber,
          })
        );

        dispatch(changeFinishedWorkoutVisibility(true));
        dispatch(setWorkoutState({ visibility: false, activity: false }));
      } else {
        // Save the state of the workout to the local storage!
        dispatch(
          setNotificationState({
            message: "😨 Something went wrong!",
            visibility: true,
          })
        );
        setTimeout(() => {
          dispatch(setNotificationState({ visibility: false }));
        }, 4000);
      }
    } catch (error) {
      console.log("Client Side Error: ", error);
    }
  };

  return (
    <React.Fragment>
      {modalVisibility && (
        <ChoiceModal
          message={modalData.message}
          description={modalData.description}
          noButtonLable={modalData.noButtonLable}
          yesButtonLable={modalData.yesButtonLable}
          acceptAction={modalData.acceptAction}
        />
      )}
      <div className={styles.modal}>
        <WorkoutDisplay />
        <div className={styles.sidebar}>
          <Timer />
          <div className={styles["buttons-wrapper"]}>
            <button onClick={onDiscardWorkout}>Discard</button>
            <button onClick={proccedWorkoutSubmission}>Finish</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default WorkoutTracker;
