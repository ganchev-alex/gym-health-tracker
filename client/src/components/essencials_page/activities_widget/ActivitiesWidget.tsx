import { useRef } from "react";
import RunningIcon from "../../../assets/svg_icon_components/RunningIcon";
import SwimmingIcon from "../../../assets/svg_icon_components/SwimmingIcon";

import styles from "./ActivitiesWidget.module.css";
import WorkoutCard from "../../workouts_page/routines_widget/WorkoutCard";

import activityIcon from "../../../assets/images/activity.png";
import caloriesIcon from "../../../assets/images/calories.png";

const ACTIVITIES_DUMMY = [
  {
    category: "Session Activity RUN",
    duration: "1:40",
    icon: <RunningIcon />,
  },
  {
    category: "Session Activity SWIM",
    duration: "1:40",
    icon: <SwimmingIcon />,
  },
  {
    category: "Session Activity SWIM",
    duration: "12:40",
    icon: <SwimmingIcon />,
  },
];

const WORKOUTS_DUMMY = [
  {
    title: "Workout 1",
    category: "Some category",
    duration: 0,
    description: "Some description",
  },
  {
    title: "Workout 2",
    category: "Some category",
    duration: 0,
    description: "Some description",
  },
];

const ActivitiesWidget = function () {
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

  return (
    <div className={styles["wrapper"]}>
      <main className={styles["review-content"]}>
        <div
          className={styles.activities}
          ref={scrollRef}
          onWheel={handleHorizontalScroll}
        >
          {ACTIVITIES_DUMMY.map((activity) => {
            return (
              <div className={styles["activity-card"]}>
                {activity.icon}
                <span>
                  <h6>{activity.category}</h6>
                  <p>Duration: {activity.duration}</p>
                </span>
              </div>
            );
          })}
        </div>
        <div className={styles.workouts}>
          {WORKOUTS_DUMMY.map((workout, index) => {
            return (
              <WorkoutCard
                _id={index.toString()}
                name={workout.title}
                description={workout.description}
                duration={workout.duration}
                category={workout.category}
                previewMode={true}
              />
            );
          })}
        </div>
      </main>
      <section className={styles.summary}>
        <div>
          <span>
            <img alt="Running shoe" src={activityIcon} />
          </span>
          <h6>Active Time: 00:00</h6>
        </div>
        <div>
          <span>
            <img alt="Running shoe" src={caloriesIcon} />
          </span>
          <h6>Burnt Calories: 305</h6>
        </div>
      </section>
    </div>
  );
};

export default ActivitiesWidget;
