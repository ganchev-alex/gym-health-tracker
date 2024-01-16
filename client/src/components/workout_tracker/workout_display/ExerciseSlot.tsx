import { useState } from "react";

import { Exercise } from "../../../features/workout";

import ExerciseHeader from "./ExerciseHeader";
import SetsTable from "./SetsTable";

import styles from "./ExerciseSlot.module.css";

const ExerciseSlot: React.FC<{ exerciseData: Exercise }> = function (props) {
  return (
    <div className={styles.slot}>
      <ExerciseHeader
        _id={props.exerciseData._id}
        name={props.exerciseData.name}
        img={props.exerciseData.image}
      />
      <SetsTable _id={props.exerciseData._id} />
    </div>
  );
};

export default ExerciseSlot;
