import React from "react";

import Categroies from "../../workouts_page/categories_widget/Categories";
import Routines from "../../workouts_page/routines_widget/Routines";
import Calendar from "../../workouts_page/calendar_widget/Calendar";
import ExploreWidget from "../../workouts_page/explore_widget/ExploreWidget";

import styles from "./WorkoutsPage.module.css";
import WorkoutPad from "../../workouts_page/workout_pad/WorkoutPad";
import WorkoutFinishedModal from "../../workouts_page/workout_finished/WorkoutFinished";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

function WorkoutsPage() {
  const visibility = useSelector((state: RootState) => {
    return state.modalsManager.workoutFinishedModal.visibility;
  });
  return (
    <React.Fragment>
      {visibility && <WorkoutFinishedModal />}
      <div className={styles["content-wrapper"]}>
        <Routines />
        <div className={styles.middle}>
          <Categroies />
          <ExploreWidget />
        </div>
        <div className={styles.right}>
          <Calendar />
          <WorkoutPad />
        </div>
      </div>
    </React.Fragment>
  );
}

export default WorkoutsPage;
