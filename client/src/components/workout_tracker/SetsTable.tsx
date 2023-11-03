import { ReactComponentElement, ReactElement, useState } from "react";
import Set from "./Set";

import styles from "./SetsTable.module.css";

const SetTable: React.FC = function () {
  const defaultSets = [
    <Set setIndex={1} previos="25kg x 12" kg={25} reps={12} />,
    <Set setIndex={2} previos="25kg x 12" kg={25} reps={12} />,
    <Set setIndex={3} previos="25kg x 12" kg={25} reps={12} />,
  ];

  const [setsList, setSetsList] = useState<JSX.Element[]>(defaultSets);

  const addSet = function () {
    const updatedSetList = [
      ...setsList,
      <Set
        setIndex={setsList.length + 1}
        previos="25kg x 12"
        kg={25}
        reps={12}
      />,
    ];
    setSetsList(updatedSetList);
  };

  return (
    <div>
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
