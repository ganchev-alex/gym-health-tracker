import { useState } from "react";

import { Exercise } from "../../../features/workout";

import ExerciseHeader from "./ExerciseHeader";
import SetsTable from "./SetsTable";

import styles from "./ExerciseSlot.module.css";

const ExerciseSlot: React.FC<{
  exerciseData: Exercise;
  index?: number;
  sets?: number;
  restTime?: number;
  notes?: string;
  staticMode?: boolean;
  previewMode?: boolean;
}> = function (props) {
  return (
    <div className={styles.slot}>
      <ExerciseHeader
        exerciseData={props.exerciseData}
        index={props.index}
        restTime={props.restTime}
        notes={props.notes}
        staticMode={props.staticMode}
        previewMode={props.previewMode}
      />
      <SetsTable
        _id={props.exerciseData._id}
        index={props.index}
        staticMode={props.staticMode}
        sets={props.sets}
        previewMode={props.previewMode}
      />
    </div>
  );
};

export default ExerciseSlot;
