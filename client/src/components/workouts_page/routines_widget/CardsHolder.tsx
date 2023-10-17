import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import WorkoutCard from "./WorkoutCard";

import styles from "./CardsHolder.module.css";

const CardsHolder: React.FC<{
  workouts: {
    name: string;
    description: string;
    duration: string;
    category: string;
  }[];
}> = (props) => {
  const filters = useSelector((state: RootState) => {
    return state.workoutWidget.selectedFilters;
  });

  let filteredWorkouts = [...props.workouts];
  if (filters.length !== 0) {
    filteredWorkouts = props.workouts.filter((workout) => {
      return filters.includes(workout.category);
    });
  }

  return (
    <div className={styles.holder}>
      {filteredWorkouts.map((workout, index) => {
        return (
          <WorkoutCard
            key={index}
            name={workout.name}
            description={workout.description}
            duration={workout.duration}
            category={workout.category}
          />
        );
      })}
    </div>
  );
};

export default CardsHolder;
