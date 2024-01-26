import { useState } from "react";

import { Exercise } from "../../../features/workout";

import ExerciseHeader from "./ExerciseHeader";
import SetsTable from "./SetsTable";

import styles from "./ExerciseSlot.module.css";

const ExerciseSlot: React.FC<{ exerciseData: Exercise; staticMode?: boolean }> =
  function (props) {
    return (
      <div className={styles.slot}>
        <ExerciseHeader
          exerciseData={props.exerciseData}
          staticMode={props.staticMode}
        />
        <SetsTable _id={props.exerciseData._id} staticMode={props.staticMode} />
      </div>
    );
  };

export default ExerciseSlot;
