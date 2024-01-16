import { useDispatch, useSelector } from "react-redux";
import NextArrowIcon from "../../../assets/svg_icon_components/NextArrowIcon";
import {
  Exercise,
  addExercise,
  setAddExerciseVisibility,
  setExerciseData,
  setExerciseVisibility,
} from "../../../features/workout";
import styles from "./ExerciseResult.module.css";
import { RootState } from "../../../features/store";
import { useEffect, useState } from "react";

const ExerciseResult: React.FC<{ exerciseData: Exercise }> = function (props) {
  const data = props.exerciseData;

  const dispatch = useDispatch();
  const { exercises } = useSelector((state: RootState) => {
    return state.workoutState;
  });

  const showSummary = function () {
    dispatch(setExerciseVisibility(true));
    dispatch(setExerciseData(data));
  };

  const onAddExercise = function () {
    dispatch(addExercise(props.exerciseData));
    dispatch(setAddExerciseVisibility(false));
  };

  const checkPresense = function () {
    return exercises.some((exercise) => exercise._id === data._id);
  };

  return (
    <div className={styles.exercise}>
      <img src={data.image} onClick={onAddExercise} />
      <div className={styles.headers} onClick={onAddExercise}>
        <h5>{data.name}</h5>
        <h6>
          {data.primaryMuscles.map((primaryMuslce, index) => {
            const updatedLabel =
              primaryMuslce.charAt(0).toUpperCase() + primaryMuslce.slice(1);
            if (index < data.primaryMuscles.length - 1) {
              return updatedLabel + ", ";
            } else {
              return updatedLabel;
            }
          })}
        </h6>
      </div>
      <button
        className={styles["next-button"]}
        type="button"
        onClick={showSummary}
      >
        <NextArrowIcon />
      </button>
    </div>
  );
};

export default ExerciseResult;
