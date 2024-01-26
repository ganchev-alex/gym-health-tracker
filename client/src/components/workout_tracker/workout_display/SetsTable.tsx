import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Set from "./Set";
import styles from "./SetsTable.module.css";
import { modifySetCount, removeExercise } from "../../../features/workout";
import {
  modifyStaticSetCount,
  removeFromNewRoutine,
} from "../../../features/widgets-actions";

const SetTable: React.FC<{ _id: string; staticMode?: boolean }> = function (
  props
) {
  const dispatch = useDispatch();

  const removeSet = function (index: number) {
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
    setSetsList((previousState) => [
      ...previousState,
      <Set
        key={previousState.length + 1}
        setIndex={previousState.length + 1}
        previos="25kg x 12"
        kg={25}
        reps={12}
        setRemover={() => removeSet(previousState.length)}
        staticMode={props.staticMode}
      />,
    ]);
  };

  const defaultSets = [
    <Set
      key={1}
      setIndex={1}
      previos="25kg x 12"
      kg={25}
      reps={12}
      setRemover={removeSet}
      staticMode={props.staticMode}
    />,
  ];

  const [setsList, setSetsList] = useState<JSX.Element[]>(defaultSets);

  useEffect(() => {
    if (!setsList.length) {
      console.log("Exercise Removed!");
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
            <th>Previous</th>
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
      <button type="button" className={styles["set-button"]} onClick={addSet}>
        Add Set
      </button>
    </div>
  );
};

export default SetTable;
