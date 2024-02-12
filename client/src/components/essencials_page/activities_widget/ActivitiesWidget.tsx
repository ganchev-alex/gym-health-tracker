import React, { useEffect, useMemo, useRef } from "react";
import RunningIcon from "../../../assets/svg_icon_components/RunningIcon";
import SwimmingIcon from "../../../assets/svg_icon_components/SwimmingIcon";

import styles from "./ActivitiesWidget.module.css";
import WorkoutCard from "../../workouts_page/routines_widget/WorkoutCard";

import activityIcon from "../../../assets/images/activity.png";
import caloriesIcon from "../../../assets/images/calories.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import ByciclingIcon from "../../../assets/svg_icon_components/ByciclingIcon";
import MeditationIcon from "../../../assets/svg_icon_components/MeditationIcon";
import WalkingIcon from "../../../assets/svg_icon_components/WalkingIcon";
import { setWorkoutState, setWorkoutTitle } from "../../../features/workout";

const ActivitiesWidget = function () {
  const dispatch = useDispatch();
  const isToday = useSelector(
    (state: RootState) => state.healthEssentials.isToday
  );
  const essentials = useSelector((state: RootState) =>
    state.healthEssentials.isToday
      ? state.healthEssentials.today
      : state.healthEssentials.yesterday
  );

  const { activityTimeTarget, burntCaloriesTarget } = useSelector(
    (state: RootState) => state.healthEssentials.targets
  );

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

  const startWorkout = function () {
    dispatch(setWorkoutTitle());
    dispatch(setWorkoutState({ visibility: true }));
  };

  const secondsConverter = function (seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className={styles["wrapper"]}>
      <main className={styles["review-content"]}>
        {essentials.activities.length === 0 &&
        essentials.workouts.length === 0 ? (
          <div className={styles["empty-data"]}>
            <h4>🕸️ No Activities </h4>
            {isToday ? (
              <p>
                Don't waste any more time and <br />
                be active today!
              </p>
            ) : (
              <p>
                Hmm... It seems like you didn't workout yesterday. <br />
                Don't worry everybody could use a rest!
              </p>
            )}
            {isToday && (
              <button onClick={startWorkout}>Start Empty Workout</button>
            )}
          </div>
        ) : (
          <React.Fragment>
            {essentials.activities.length > 0 && (
              <div
                className={styles.activities}
                ref={scrollRef}
                onWheel={handleHorizontalScroll}
              >
                {essentials.activities.map((session, index) => {
                  return (
                    <div key={index} className={styles["activity-card"]}>
                      {session.category === "Activity Session: RUN" ? (
                        <RunningIcon />
                      ) : session.category === "Activity Session: BIKE" ? (
                        <ByciclingIcon />
                      ) : session.category === "Activity Session: MEDITATE" ? (
                        <MeditationIcon />
                      ) : session.category === "Activity Session: SWIM" ? (
                        <SwimmingIcon />
                      ) : session.category === "Activity Session: WALK" ? (
                        <WalkingIcon />
                      ) : null}
                      <span>
                        <h6>{session.category}</h6>
                        <p>Duration: {secondsConverter(session.duration)}</p>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {essentials.workouts.length > 0 ? (
              <div className={styles.workouts}>
                {essentials.workouts.map((workout) => {
                  return (
                    <WorkoutCard
                      key={workout._id}
                      _id={workout._id}
                      name={workout.title}
                      description={""}
                      duration={workout.duration}
                      category={workout.category}
                      previewMode={true}
                      volume={workout.volume}
                    />
                  );
                })}
              </div>
            ) : (
              <div className={styles["empty-data"]}>
                <h4>🪹 No workouts</h4>
                <p>
                  You didn't do any specific workouts yet but you stayed active!
                </p>
                <button onClick={startWorkout}>Start Empty Workout</button>
              </div>
            )}
          </React.Fragment>
        )}
      </main>
      <section className={styles.summary}>
        <div>
          <span>
            <img alt="Running shoe" src={activityIcon} />
          </span>
          <h6>
            Active Time:{" "}
            <b
              style={
                essentials.activityTime > activityTimeTarget
                  ? { color: "#28cfc6" }
                  : undefined
              }
            >
              {secondsConverter(essentials.activityTime)}
            </b>{" "}
            / {secondsConverter(activityTimeTarget)}
          </h6>
        </div>
        <div>
          <span>
            <img alt="Running shoe" src={caloriesIcon} />
          </span>
          <h6>
            Burnt Calories:{" "}
            <b
              style={
                essentials.burntCalories > burntCaloriesTarget
                  ? { color: "#4858e7" }
                  : undefined
              }
            >
              {essentials.burntCalories}
            </b>
            / {burntCaloriesTarget}
          </h6>
        </div>
      </section>
    </div>
  );
};

export default ActivitiesWidget;
