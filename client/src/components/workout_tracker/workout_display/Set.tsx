import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  setRestTimerState,
  setSetData,
  setSetState,
  setTotalValues,
} from "../../../features/workout";
import { RootState } from "../../../features/store";

import styles from "./SetsTable.module.css";
import setStyles from "./Set.module.css";

import CheckBoxIcon from "../../../assets/svg_icon_components/CheckboxIcon";
import RemoveIcon from "../../../assets/svg_icon_components/RemoveIcon";

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

  const exercise = useSelector((state: RootState) => {
    return state.workoutState.exercises[props.exerciseIndex || 0];
  });

  const { isMale } = useSelector((state: RootState) => state.userActions);

  let setState = { state: false, kg: 0, reps: 0 };
  if (!props.staticMode && exercise) {
    setState = exercise.setsData
      ? exercise.setsData[props.setIndex - 1]
      : { state: false, kg: 0, reps: 0 };
  }

  const [reps, setReps] = useState(setState?.reps || 0);
  const [kg, setKg] = useState(setState?.kg || 0);

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

  const onCheck = function () {
    if (!props.staticMode) {
      if (setState?.state) {
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
          setState: !setState?.state,
        })
      );

      const dispatchedValues = {
        reps: reps === 0 ? props.reps : reps,
        kg: kg === 0 ? props.kg : kg,
      };

      dispatch(
        setTotalValues({
          increasment: !setState?.state,
          volume: dispatchedValues.kg * dispatchedValues.reps,
        })
      );
    }
  };

  return (
    <tr
      className={`${isMale ? styles.male : styles.female} ${
        setState?.state ? styles["checked-row"] : ""
      }`}
    >
      <td className={setStyles["cell-wrapper"]}>
        <span className={!props.previewMode ? setStyles["set-index"] : ""}>
          {props.setIndex}
        </span>
        {!props.previewMode && (
          <button
            className={setStyles["remove-button"]}
            type="button"
            style={
              setState?.state === true ? { filter: "invert(0.3)" } : undefined
            }
            onClick={() => {
              if (setState?.state !== true)
                props.setRemover(props.setIndex - 1);
            }}
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
          value={kg || ""}
          onChange={(e) => {
            setKg(Number.parseFloat(e.target.value));
          }}
          placeholder={props.kg.toString()}
          disabled={props.staticMode || setState?.state}
          autoComplete="off"
        />
      </td>
      <td>
        <input
          type="number"
          name="reps"
          id="reps"
          value={reps || ""}
          onChange={(e) => setReps(Number.parseInt(e.target.value))}
          placeholder={props.reps.toString()}
          disabled={props.staticMode || setState?.state}
          autoComplete="off"
        />
      </td>
      <td className={styles["checkbox-container"]}>
        <input
          type="checkbox"
          onChange={onCheck}
          disabled={
            (props.kg === 0 || props.reps === 0) && (kg === 0 || reps === 0)
          }
        />
        <CheckBoxIcon checkState={setState?.state} />
      </td>
    </tr>
  );
};

export default Set;
