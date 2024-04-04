import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Set from "./Set";
import styles from "./SetsTable.module.css";
import {
  addSetData,
  modifySetCount,
  removeExercise,
  removeSetData,
} from "../../../features/workout";
import {
  modifyStaticSetCount,
  removeFromNewRoutine,
} from "../../../features/workout-page-actions";
import { RootState } from "../../../features/store";

const SetTable: React.FC<{
  _id: string;
  index?: number;
  sets?: number;
  kg?: number;
  reps?: number;
  staticMode?: boolean;
  previewMode?: boolean;
  setsData?: {
    state: boolean;
    reps: number;
    kg: number;
  }[];
}> = function (props) {
  const dispatch = useDispatch();

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const removeSet = function (index: number) {
    if (props.index != undefined && !props.staticMode) {
      dispatch(removeSetData({ exerciseIndex: props.index, setIndex: index }));
    }

    setSetsList((previousState) => {
      return previousState
        .filter((set, i) => {
          return i !== index;
        })
        .map((set, i) => {
          if (i >= index) {
            return React.cloneElement(set, {
              key: i + 1,
              setIndex: i + 1,
              setRemover: () => removeSet(i),
            });
          }
          return set;
        });
    });
  };

  const addSet = function () {
    if (props.index != undefined && !props.staticMode) {
      dispatch(
        addSetData({
          exerciseIndex: props.index,
          setData: {
            state: false,
            reps: props.reps ? props.reps : 0,
            kg: props.kg ? props.kg : 0,
          },
        })
      );
    }
    setSetsList((previousState) => {
      return [
        ...previousState,
        <Set
          key={previousState.length + 1}
          exerciseId={props._id}
          exerciseIndex={props.index}
          setIndex={previousState.length + 1}
          previos={`${props.kg ? props.kg : 0}kg x ${
            props.reps ? props.reps : 0
          }`}
          kg={props.kg ? props.kg : 0}
          reps={props.reps ? props.reps : 0}
          setRemover={() => removeSet(previousState.length)}
          staticMode={props.staticMode}
        />,
      ];
    });
  };

  const defaultSets = props.sets
    ? Array.from({ length: props.sets }, (_, index) => (
        <Set
          key={index + 1}
          exerciseId={props._id}
          exerciseIndex={props.index}
          setIndex={index + 1}
          previos={
            props.previewMode
              ? `${props.setsData ? props.setsData[index].kg : 0}kg x ${
                  props.setsData ? props.setsData[index].reps : 0
                }`
              : `${props.kg ? props.kg : 0}kg x ${props.reps ? props.reps : 0}`
          }
          kg={
            props.previewMode
              ? props.setsData
                ? props.setsData[index].kg
                : 0
              : props.kg
              ? props.kg
              : 0
          }
          reps={
            props.previewMode
              ? props.setsData
                ? props.setsData[index].reps
                : 0
              : props.reps
              ? props.reps
              : 0
          }
          setRemover={() => removeSet(index)}
          staticMode={props.staticMode}
          previewMode={props.previewMode}
        />
      ))
    : [
        <Set
          key={1}
          exerciseId={props._id}
          exerciseIndex={props.index}
          setIndex={1}
          previos={`${props.kg ? props.kg : 0}kg x ${
            props.reps ? props.reps : 0
          }`}
          kg={props.kg ? props.kg : 0}
          reps={props.reps ? props.reps : 0}
          setRemover={() => removeSet(0)}
          staticMode={props.staticMode}
          previewMode={props.previewMode}
        />,
      ];

  const [setsList, setSetsList] = useState<JSX.Element[]>(defaultSets);

  useEffect(() => {
    if (!setsList.length) {
      if (props.staticMode) {
        dispatch(removeFromNewRoutine(props._id));
      } else {
        dispatch(removeExercise(props._id));
      }
    } else {
      if (props.staticMode) {
        dispatch(
          modifyStaticSetCount({ id: props._id, count: setsList.length })
        );
      } else {
        dispatch(modifySetCount({ id: props._id, count: setsList.length }));
      }
    }
  }, [setsList]);

  return (
    <div className={styles.holder}>
      <table className={styles["set-table"]}>
        <thead>
          <tr>
            <th>Set</th>
            <th>{props.previewMode ? "TOTAL" : "BEST"}</th>
            <th>KG</th>
            <th>Reps</th>
            <th>✓</th>
          </tr>
        </thead>
        <tbody>
          {setsList.map((set) => {
            return set;
          })}
        </tbody>
      </table>
      {!props.previewMode && (
        <button
          type="button"
          className={styles["set-button"]}
          style={
            isMale ? { color: "#472ED8", borderColor: "#472ED8" } : undefined
          }
          onClick={addSet}
        >
          Add Set
        </button>
      )}
    </div>
  );
};

export default SetTable;
