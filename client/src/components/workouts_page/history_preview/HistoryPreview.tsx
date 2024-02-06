import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import React, { useEffect, useRef, useState } from "react";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import ReactDOM from "react-dom";

import backdropStyles from "../../workout_tracker/add_exercise/AddExerciseForm.module.css";
import styles from "./HistoryPreview.module.css";

import { resetHistoryRecords } from "../../../features/widgets-actions";
import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";
import ExerciseSlot from "../../workout_tracker/workout_display/ExerciseSlot";
import { setLoadingState } from "../../../features/loading-actions";
import LoadingPlane from "../../UI/LoadingPlane/LoadingPlane";
import RunningIcon from "../../../assets/svg_icon_components/RunningIcon";
import ByciclingIcon from "../../../assets/svg_icon_components/ByciclingIcon";
import MeditationIcon from "../../../assets/svg_icon_components/MeditationIcon";
import SwimmingIcon from "../../../assets/svg_icon_components/SwimmingIcon";
import WalkingIcon from "../../../assets/svg_icon_components/WalkingIcon";

interface FetchedExercise {
  exerciseId: {
    _id: string;
    image: string;
  };
  name: string;
  sets: {
    reps: number;
    kg: number;
  }[];
  notes: string;
}

interface FetchedWorkout {
  _id: string;
  title: string;
  category: string;
  exercises: FetchedExercise[];
  duration: number;
  volume: number;
  sets: number;
}

export interface ExerciseData {
  _id: string;
  image: string;
  name: string;
  sets: {
    reps: number;
    kg: number;
  }[];
  notes: string;
}

export interface Workout {
  _id: string;
  title: string;
  category: string;
  exercises: ExerciseData[];
  duration: number;
  volume: number;
  sets: number;
}

const Backdrop = function () {
  const dispatch = useDispatch();
  return (
    <div
      className={backdropStyles.backdrop}
      onClick={() => dispatch(resetHistoryRecords())}
    />
  );
};

const HistoryPreview = function () {
  const dispatch = useDispatch();

  const [index, setIndex] = useState(0);
  const [loadedWorkouts, setLoadedWorkouts] = useState<Workout[]>([]);
  const historyRecords = useSelector(
    (state: RootState) => state.widgetsManager.calendarWidget.previewRecords
  );

  const isLoading = useSelector(
    (state: RootState) => state.loadingManager.isLoading
  );

  const [workoutData, setWorkoutData] = useState<Workout>({
    _id: "",
    title: "",
    category: "",
    exercises: [],
    duration: 0,
    volume: 0,
    sets: 0,
  });

  useEffect(() => {
    const getWorkoutData = async function () {
      try {
        dispatch(setLoadingState(true));
        const response = await fetch(
          `${mainAPIPath}/app/history-records?workoutId=${historyRecords.workoutRecords[index].workoutId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (response.ok) {
          const data: { message: string; workout: FetchedWorkout } =
            await response.json();
          const { workout } = data;
          const newData = {
            _id: workout._id,
            title: workout.title,
            category: workout.category,
            exercises: workout.exercises.map((exercise) => {
              return {
                _id: exercise.exerciseId._id,
                image: exercise.exerciseId.image,
                name: exercise.name,
                sets: exercise.sets,
                notes: exercise.notes,
              };
            }),
            duration: workout.duration,
            volume: workout.volume,
            sets: workout.sets,
          };
          setWorkoutData(newData);
          setLoadedWorkouts((previousState) => {
            if (!previousState.some((workout) => workout._id === newData._id))
              return [...previousState, newData];
            else return [...previousState];
          });
        } else {
          // Please try again.
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoadingState(false));
      }
    };

    if (historyRecords.workoutRecords.length > 0) {
      if (loadedWorkouts[index]) {
        setWorkoutData(loadedWorkouts[index]);
      } else {
        getWorkoutData();
      }
    }
  }, [index]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const handleHorizontalScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = event.deltaY * 1.5;
      const scrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;

      let newScrollLeft = scrollLeft + scrollAmount;

      newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
      smoothScroll(container, scrollLeft, newScrollLeft);

      event.preventDefault();
    }
  };

  const smoothScroll = (
    element: HTMLElement,
    start: number,
    end: number,
    duration = 300
  ) => {
    const startTime = performance.now();
    const animateScroll = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutQuart(progress);

      element.scrollTo({
        left: start + (end - start) * ease,
        behavior: "auto",
      });

      if (elapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const easeOutQuart = (t: number) => {
    return 1 - --t * t * t * t;
  };

  let activityPreview: JSX.Element | null = null;
  if (historyRecords.sessionRecords.length > 0) {
    switch (historyRecords.sessionRecords[0].category) {
      case "Activity Session: RUN":
        activityPreview = <RunningIcon />;
        break;
      case "Activity Session: BIKE":
        activityPreview = <ByciclingIcon />;
        break;
      case "Activity Session: MEDITATE":
        activityPreview = <MeditationIcon />;
        break;
      case "Activity Session: SWIM":
        activityPreview = <SwimmingIcon />;
        break;
      case "Activity Session: WALK":
        activityPreview = <WalkingIcon />;
        break;
    }
  }

  return (
    <div
      className={styles.modal}
      style={
        historyRecords.workoutRecords.length > 0
          ? {}
          : { height: "fit-content" }
      }
    >
      {isLoading && <LoadingPlane />}
      <header className={styles.header}>
        {historyRecords.workoutRecords.length > 1 && (
          <button
            style={index == 0 ? { background: "#E0E0E0" } : {}}
            disabled={index == 0}
            onClick={() => setIndex((previousIndex) => previousIndex - 1)}
          >
            Prev.
          </button>
        )}
        <h3>
          Workout Records:{" "}
          <span>
            {new Date(
              historyRecords.workoutRecords.length > 0
                ? historyRecords.workoutRecords[index].date
                : historyRecords.sessionRecords[index].date
            ).toDateString()}
          </span>
        </h3>
        {historyRecords.workoutRecords.length > 1 && (
          <button
            style={
              index == historyRecords.workoutRecords.length - 1
                ? { background: "#E0E0E0" }
                : {}
            }
            disabled={index == historyRecords.workoutRecords.length - 1}
            onClick={() => setIndex((previousIndex) => previousIndex + 1)}
          >
            Next
          </button>
        )}
      </header>
      {historyRecords.sessionRecords.length > 0 && (
        <div
          className={styles["sessions-wrapper"]}
          ref={scrollRef}
          onWheel={handleHorizontalScroll}
        >
          {historyRecords.sessionRecords.map((session, index) => {
            return (
              <div className={styles["activity-card"]} key={index}>
                {session.category === "Activity Session: RUN" ? (
                  <RunningIcon />
                ) : session.category === "Activity Session: BIKE" ? (
                  <ByciclingIcon />
                ) : session.category ===
                  "Activity Session: Activity Session: MEDITATE" ? (
                  <MeditationIcon />
                ) : session.category === "Activity Session: SWIM" ? (
                  (activityPreview = <SwimmingIcon />)
                ) : session.category === "Activity Session: WALK" ? (
                  <WalkingIcon />
                ) : null}
                <div>
                  <h6>{session.category}</h6>
                  <p>
                    Duration:{" "}
                    {`${String(Math.floor(session.duration / 3600)).padStart(
                      2,
                      "0"
                    )}:${String(
                      Math.floor((session.duration % 3600) / 60)
                    ).padStart(2, "0")}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {historyRecords.workoutRecords.length > 0 ? (
        <React.Fragment>
          <div className={styles.details}>
            <h2>{workoutData.title}</h2>
            <div className={styles["main-details"]}>
              <span>
                <TimerIcon />
                {`${String(Math.floor(workoutData.duration / 3600)).padStart(
                  2,
                  "0"
                )}:${String(
                  Math.floor((workoutData.duration % 3600) / 60)
                ).padStart(2, "0")}`}
              </span>
              <p>{workoutData.category}</p>
            </div>
            <div className={styles.totals}>
              <p>
                Total Volume: <span>{workoutData.volume}</span>
              </p>
              <p>
                Total Sets: <span>{workoutData.sets}</span>
              </p>
            </div>
          </div>
          <main
            className={styles["exercise-wrapper"]}
            style={
              historyRecords.sessionRecords.length > 0 ? { height: "59%" } : {}
            }
          >
            {workoutData.exercises.map((exercise, index) => {
              return (
                <ExerciseSlot
                  key={index}
                  exerciseData={{
                    _id: exercise._id,
                    name: exercise.name,
                    equipment: "",
                    primaryMuscles: [],
                    secondaryMuscles: [],
                    instructions: [],
                    image: exercise.image,
                    sets: exercise.sets.length,
                    notes: exercise.notes,
                    setsData: exercise.sets.map((set) => {
                      return { state: true, ...set };
                    }),
                  }}
                  sets={exercise.sets.length}
                  restTime={0}
                  notes={exercise.notes}
                  staticMode={true}
                  previewMode={true}
                  historyMode={true}
                />
              );
            })}
          </main>
        </React.Fragment>
      ) : (
        <div className={styles["empty-workouts"]}>
          <h6>🪹 Empty Workout Box...</h6>
          <p>
            You did not do any specific workouts that day, <br /> but you stayed
            active!
          </p>
        </div>
      )}
    </div>
  );
};

const HistoryPreviewModal = function () {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<HistoryPreview />, overlayRoot)}
    </React.Fragment>
  );
};

export default HistoryPreviewModal;