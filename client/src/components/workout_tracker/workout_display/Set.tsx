import { useEffect, useState } from "react";

import CheckBoxIcon from "../../../assets/svg_icon_components/CheckboxIcon";
import RemoveIcon from "../../../assets/svg_icon_components/RemoveIcon";

import styles from "./SetsTable.module.css";
import setStyles from "./Set.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setRestTimerState,
  setSetData,
  setSetState,
  setTotalValues,
} from "../../../features/workout";
import { RootState } from "../../../features/store";

const Set: React.FC<{
  exerciseId: string;
  setIndex: number;
  exerciseIndex?: number;
  previos: string;
  kg: number;
  reps: number;
  setRemover: (index: number) => void;
  staticMode?: boolean;
  previewMode?: boolean;
}> = function (props) {
  const dispatch = useDispatch();

  const [reps, setReps] = useState(props.reps);
  const [kg, setKg] = useState(props.kg);

  const exercise = useSelector((state: RootState) => {
    return state.workoutState.exercises[props.exerciseIndex || 0];
  });

  let setState = { state: false };
  if (!props.staticMode) {
    setState = exercise?.setsData
      ? exercise.setsData[props.setIndex - 1]
      : { state: false };
  }

  useEffect(() => {
    if (!props.staticMode && props.exerciseIndex != undefined) {
      dispatch(
        setSetData({
          exerciseIndex: props.exerciseIndex,
          setIndex: props.setIndex - 1,
          volume: kg,
          reps,
        })
      );
    }
  }, [dispatch, props.staticMode, props.exerciseId, props.setIndex, kg, reps]);

  const onCheck = function (event: React.ChangeEvent<HTMLInputElement>) {
    if (!props.staticMode) {
      if (setState.state) {
        dispatch(setRestTimerState({ activity: false }));
      } else {
        dispatch(
          setRestTimerState({
            activity: true,
            timer: exercise?.restTime,
          })
        );

        setKg((prevKg) => (prevKg === 0 ? props.kg : prevKg));
        setReps((prevReps) => (prevReps === 0 ? props.reps : prevReps));
      }

      dispatch(
        setSetState({
          exerciseIndex: props.exerciseIndex || 0,
          setIndex: props.setIndex - 1,
          setState: !setState.state,
        })
      );

      const dispatchedValues = {
        reps: reps === 0 ? props.reps : reps,
        kg: kg === 0 ? props.kg : kg,
      };

      dispatch(
        setTotalValues({
          increasment: !setState.state,
          volume: dispatchedValues.kg * dispatchedValues.reps,
        })
      );
    }
  };

  return (
    <tr className={setState.state ? styles["checked-row"] : ""}>
      <td className={setStyles["cell-wrapper"]}>
        <span className={!props.previewMode ? setStyles["set-index"] : ""}>
          {props.setIndex}
        </span>
        {!props.previewMode && (
          <button
            className={setStyles["remove-button"]}
            type="button"
            onClick={() => props.setRemover(props.setIndex - 1)}
          >
            <RemoveIcon />
          </button>
        )}
      </td>
      <td>{props.previos}</td>
      <td>
        <input
          type="number"
          name="kg"
          id="kg"
          value={kg == 0 ? "" : kg}
          onChange={(e) => {
            setKg(Number.parseFloat(e.target.value));
          }}
          placeholder={props.kg.toString()}
          disabled={props.staticMode || setState.state}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          type="number"
          name="reps"
          id="reps"
          value={reps == 0 ? "" : reps}
          onChange={(e) => setReps(Number.parseInt(e.target.value))}
          placeholder={props.reps.toString()}
          disabled={props.staticMode || setState.state}
          autoComplete="off"
        />
      </td>
      <td className={styles["checkbox-container"]}>
        <input
          type="checkbox"
          onChange={onCheck}
          disabled={kg === 0 || reps === 0}
        />
        <CheckBoxIcon checkState={setState.state} />
      </td>
    </tr>
  );
};

export default Set;
