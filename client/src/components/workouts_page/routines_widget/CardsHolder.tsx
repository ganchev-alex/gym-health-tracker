import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import WorkoutCard from "./WorkoutCard";

import styles from "./CardsHolder.module.css";

const CardsHolder: React.FC = () => {
  const filters = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.selectedFilters;
  });

  const routines = useSelector((state: RootState) => {
    return state.userActions.loadedUserData.routines;
  });

  let filteredWorkouts = [...routines];
  if (filters.length !== 0) {
    filteredWorkouts = routines.filter((routine) => {
      return filters.includes(routine.category);
    });
  }

  return (
    <div className={styles.holder}>
      {filteredWorkouts.map((routine) => {
        return (
          <WorkoutCard
            key={routine._id}
            _id={routine._id}
            name={routine.title}
            description={routine.description}
            duration={routine.duration}
            category={routine.category}
          />
        );
      })}
    </div>
  );
};

export default CardsHolder;
