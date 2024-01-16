import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Set from "./Set";
import styles from "./SetsTable.module.css";
import { removeExercise } from "../../../features/workout";

const SetTable: React.FC<{ _id: string }> = function (props) {
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
    />,
  ];

  const [setsList, setSetsList] = useState<JSX.Element[]>(defaultSets);

  useEffect(() => {
    if (!setsList.length) {
      console.log("Exercise Removed!");
      dispatch(removeExercise(props._id));
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
      <button className={styles["set-button"]} onClick={addSet}>
        Add Set
      </button>
    </div>
  );
};

export default SetTable;
