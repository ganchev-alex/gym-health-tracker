import { useDispatch, useSelector } from "react-redux";
import NextArrowIcon from "../../../assets/svg_icon_components/NextArrowIcon";
import {
  Exercise,
  addExercise,
  replaceExercise,
  setAddExerciseState,
  setExerciseData,
  setExerciseSummaryVisibility,
  setOptionsMenuState,
} from "../../../features/workout";
import styles from "./ExerciseResult.module.css";
import { RootState } from "../../../features/store";
import {
  addToNewRoutine,
  replaceExerciseFromRoutine,
} from "../../../features/workout-page-actions";
import { mainAPIPath } from "../../../App";
import { setLoadingState } from "../../../features/loading-actions";
import { getToken } from "../../../util/auth";

const ExerciseResult: React.FC<{ exerciseData: Exercise }> = function (props) {
  const data = props.exerciseData;

  const dispatch = useDispatch();
  const { optionsMenuState, addExerciseState } = useSelector(
    (state: RootState) => {
      return state.workoutState;
    }
  );

  const showSummary = function () {
    dispatch(setExerciseSummaryVisibility(true));
    dispatch(setExerciseData(data));
  };

  const onAddExercise = async function () {
    dispatch(setLoadingState(true));
    const bestSet = await fetchBestSet(props.exerciseData._id);
    dispatch(setLoadingState(false));
    switch (addExerciseState.mode) {
      case "REPLACE":
        dispatch(
          replaceExercise({
            currant: optionsMenuState.exerciseId || "",
            replaceWith: { ...props.exerciseData, bestSet },
          })
        );
        dispatch(setOptionsMenuState({ visibility: false }));
        break;
      case "REPLACE_ROUTINE":
        dispatch(
          replaceExerciseFromRoutine({
            currant: optionsMenuState.exerciseId || "",
            replaceWith: { ...props.exerciseData, bestSet },
          })
        );
        dispatch(setOptionsMenuState({ visibility: false }));
        break;
      case "ADD_ROUTINE":
        dispatch(addToNewRoutine({ ...props.exerciseData, bestSet }));
        break;
      case "ADD":
      default:
        dispatch(addExercise({ ...props.exerciseData, bestSet }));
        break;
    }

    dispatch(setAddExerciseState({ visibility: false }));
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

export const fetchBestSet = async function (exerciseId: string) {
  try {
    const response = await fetch(
      `${mainAPIPath}/exercise/best-set?exerciseId=${exerciseId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (response.ok) {
      const data: { bestSet: { kg: number; reps: number } } =
        await response.json();
      console.log(data.bestSet);
      return data.bestSet;
    } else {
      return { kg: 0, reps: 0 };
    }
  } catch {
    return { kg: 0, reps: 0 };
  }
};
