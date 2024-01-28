import { useState } from "react";

import { Exercise } from "../../../features/workout";

import ExerciseHeader from "./ExerciseHeader";
import SetsTable from "./SetsTable";

import styles from "./ExerciseSlot.module.css";

const ExerciseSlot: React.FC<{
  exerciseData: Exercise;
  sets?: number;
  restTime?: number;
  staticMode?: boolean;
  previewMode?: boolean;
}> = function (props) {
  return (
    <div className={styles.slot}>
      <ExerciseHeader
        exerciseData={props.exerciseData}
        restTime={props.restTime}
        staticMode={props.staticMode}
        previewMode={props.previewMode}
      />
      <SetsTable
        _id={props.exerciseData._id}
        staticMode={props.staticMode}
        sets={props.sets}
        previewMode={props.previewMode}
      />
    </div>
  );
};

export default ExerciseSlot;
