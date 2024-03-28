import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Timer from "./Timer";
import WorkoutDisplay from "./WorkoutDisplay";

import styles from "./WorkoutTracker.module.css";
import {
  setChoiceModalVisibility,
  changeFinishedWorkoutVisibility,
  finishedWorkoutData,
} from "../../../features/modals";
import { RootState } from "../../../features/store";
import ChoiceModal from "../../UI/ChoiceModal/ChoiceModal";
import {
  operateOnRestTimer,
  restoreWorkoutInitialState,
  setWorkoutState,
} from "../../../features/workout";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import {
  appendNewHistory,
  setNotificationState,
  setSessionActivity,
} from "../../../features/workout-page-actions";

import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";

import runningBackground from "../../../assets/images/running_background.jpg";
import cyclingBackground from "../../../assets/images/cycling_background.jpg";
import meditationBackground from "../../../assets/images/meditation_background.jpg";
import swimmingBackground from "../../../assets/images/swimming_background.jpg";
import walkingBackground from "../../../assets/images/walking_background.jpg";
import LoadingPlane from "../../UI/LoadingPlane/LoadingPlane";
import {
  Session,
  Workout,
} from "../../workouts_page/history_preview/HistoryPreview";
import {
  appendSessionData,
  appendWorkoutsData,
} from "../../../features/health-essentials-actions";
import { useNavigate } from "react-router-dom";
import { secondsConverter } from "../../essencials_page/activities_widget/ActivitiesWidget";

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
  const [imageLoadState, setImageLoadState] = useState(false);

  const timer = useSelector((state: RootState) => {
    return state.workoutState.duration;
  });

  const restTimer = useSelector(
    (state: RootState) => state.workoutState.restTimer
  );

  const userWeigth = useSelector((state: RootState) => {
    return state.userActions.loadedUserData.personalDetails.weight;
  });
  const { selectedActivity, sessionActivity } = useSelector(
    (state: RootState) => {
      return state.widgetsManager.categoriesWidget;
    }
  );

  const workoutState = useSelector((state: RootState) => state.workoutState);

  const modalVisibility = useSelector(
    (state: RootState) => state.modalsManager.choiceModal.visibility
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const hours = Math.floor(timer / 3600);
  const minutes = Math.floor((timer % 3600) / 60);
  const remainingSeconds = timer % 60;

  const restMinutes = Math.floor((restTimer.timer % 3600) / 60);
  const restSeconds = restTimer.timer % 60;

  useEffect(() => {
    if (sessionActivity) {
      const newModalData = modalMode
        ? {
            message: "Finish session",
            description: "Are you all set?",
            noButtonLable: "No",
            yesButtonLable: "Proceed",
            acceptAction: submitSession,
          }
        : {
            message: "Discard Session",
            description:
              "Are you sure you want to discard your session? This process won't save your session and will result in the lost of your progress.",
            noButtonLable: "Cancel",
            yesButtonLable: "Discard",
            acceptAction: () => {
              dispatch(
                setSessionActivity({
                  selectedActivity: "",
                  sessionActivity: false,
                })
              );
              dispatch(restoreWorkoutInitialState());
            },
          };
      setModalData(newModalData);
    } else {
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
    }
  }, [modalMode]);

  let source;
  let caloriesMultiplier: number;
  switch (selectedActivity) {
    case "RUN":
      caloriesMultiplier = 9.8;
      source = runningBackground;
      break;
    case "BIKE":
      caloriesMultiplier = 6;
      source = cyclingBackground;
      break;
    case "MEDITATE":
      caloriesMultiplier = 0;
      source = meditationBackground;
      break;
    case "SWIM":
      caloriesMultiplier = 10;
      source = swimmingBackground;
      break;
    case "WALK":
      caloriesMultiplier = 3.9;
      source = walkingBackground;
      break;
    default:
      source = meditationBackground;
      caloriesMultiplier = 0;
  }

  const onDiscardWorkout = function () {
    dispatch(setChoiceModalVisibility(true));
  };

  const sessionAction = function () {
    dispatch(setChoiceModalVisibility(true));
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
      dispatch(setChoiceModalVisibility(true));
    }
  };

  const submitWorkout = async function () {
    const workoutData = {
      date: new Date().toISOString(),
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
            muscles: [...exercise.primaryMuscles, ...exercise.secondaryMuscles],
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
          workoutData: Workout;
        };
        dispatch(
          finishedWorkoutData({
            records: data.newRecords,
            number: data.workoutNumber,
          })
        );

        dispatch(
          appendNewHistory({
            workoutRecords: {
              workoutId: data.workoutData._id,
              date: new Date().toISOString(),
            },
          })
        );
        dispatch(appendWorkoutsData([data.workoutData]));
        dispatch(restoreWorkoutInitialState());
        dispatch(changeFinishedWorkoutVisibility(true));
        navigate("/app/dashboard");
      } else {
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
  };
  const submitSession = async function () {
    const sessionData = {
      date: new Date().toISOString(),
      title: workoutState.workoutTitle,
      category: "Activity Session: " + selectedActivity,
      duration: workoutState.duration,
      burntCalories: Math.floor(
        caloriesMultiplier * userWeigth * (timer / 3600)
      ),
    };

    try {
      const response = await fetch(`${mainAPIPath}/app/save-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(sessionData),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          sessionNumber: number;
          sessionData: Session;
        };
        dispatch(
          finishedWorkoutData({ records: [], number: data.sessionNumber })
        );
        dispatch(appendNewHistory({ sessionRecords: data.sessionData }));
        dispatch(appendSessionData([data.sessionData]));
        dispatch(restoreWorkoutInitialState());
        dispatch(changeFinishedWorkoutVisibility(true));
        navigate("/app/dashboard");
      } else {
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
    } catch {}
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
        {sessionActivity ? (
          <div className={styles["session-wrapper"]}>
            <img
              alt="Session tracker background"
              src={source}
              onLoad={() => {
                setImageLoadState(true);
              }}
            />
            <div
              className={`${isMale ? styles.male : styles.female} ${
                styles.filter
              }`}
            />
            <div className={styles["session-timer"]}>
              <TimerIcon />
              <h3>Duration</h3>
              <h4>{`${String(hours).padStart(2, "0")}:${String(
                minutes
              ).padStart(2, "0")}:${String(remainingSeconds).padStart(
                2,
                "0"
              )}`}</h4>
              {caloriesMultiplier != 0 && (
                <h5>
                  Calories:{" "}
                  {Math.floor(caloriesMultiplier * userWeigth * (timer / 3600))}
                </h5>
              )}
            </div>
            <div className={styles.controlls}>
              <button onClick={sessionAction}>Discard</button>
              <button
                onClick={() => {
                  setModalMode(true);
                  sessionAction();
                }}
                style={
                  isMale
                    ? { backgroundColor: "#472ed8", borderColor: "#472ed8" }
                    : undefined
                }
              >
                End Session
              </button>
            </div>
            {!imageLoadState && (
              <div className={styles["loading-plane-mod"]}>
                <LoadingPlane />
              </div>
            )}
          </div>
        ) : (
          <React.Fragment>
            <div
              className={styles["mini-header"]}
              style={
                isMale
                  ? {
                      background:
                        "linear-gradient(-125deg, #472ED8 20.25%, #29156B 100%)",
                    }
                  : undefined
              }
            >
              <p>
                Duration:{" "}
                {`${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                  2,
                  "0"
                )}:${String(remainingSeconds).padStart(2, "0")}`}
              </p>
            </div>
            <WorkoutDisplay />
            <div className={styles.sidebar}>
              <Timer />
              <div className={styles["buttons-wrapper"]}>
                <button onClick={onDiscardWorkout}>Discard</button>
                <button
                  onClick={proccedWorkoutSubmission}
                  disabled={workoutState.exercises.length === 0}
                  style={isMale ? { backgroundColor: "#472ed8" } : undefined}
                >
                  Finish
                </button>
              </div>
            </div>
            {restTimer.active && (
              <div
                className={styles["mini-controller"]}
                style={
                  isMale
                    ? {
                        background:
                          "linear-gradient(-125deg, #472ED8 20.25%, #29156B 100%)",
                      }
                    : undefined
                }
              >
                <button
                  onClick={() =>
                    dispatch(
                      operateOnRestTimer({ increment: false, value: 15 })
                    )
                  }
                >
                  -15
                </button>
                <p>{`${String(restMinutes).padStart(2, "0")}:${String(
                  restSeconds
                ).padStart(2, "0")}`}</p>
                <button
                  onClick={() =>
                    dispatch(operateOnRestTimer({ increment: true, value: 15 }))
                  }
                >
                  +15
                </button>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default WorkoutTracker;
