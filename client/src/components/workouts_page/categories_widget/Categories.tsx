import React from "react";

import Activities from "./Activities";
import WorkoutsButton from "./WorkoutsButtons";
import RoutineForm from "../routine_manager/RoutineForm";

import styles from "./Categories.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

const Categroies: React.FC = () => {
  const formVisibility = useSelector((state: RootState) => {
    return state.widgetsManager.workoutWidget.newRoutine.formVisibility;
  });

  return (
    <React.Fragment>
      {formVisibility && <RoutineForm />}
      <div className={styles.widget}>
        <div className={styles.header}>
          <h6>Categories</h6>
          <a>See all</a>
        </div>
        <Activities />
        <WorkoutsButton />
      </div>
    </React.Fragment>
  );
};

export default Categroies;
