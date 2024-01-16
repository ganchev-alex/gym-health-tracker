import { useState } from "react";

import CheckBoxIcon from "../../../assets/svg_icon_components/CheckboxIcon";
import RemoveIcon from "../../../assets/svg_icon_components/RemoveIcon";

import styles from "./SetsTable.module.css";
import setStyles from "./Set.module.css";

const Set: React.FC<{
  setIndex: number;
  previos: string;
  kg: number;
  reps: number;
  setRemover: (index: number) => void;
}> = function (props) {
  const [isChecked, setIsChecked] = useState(false);

  const onCheck = function (event: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(event.target.checked);
  };

  return (
    <tr className={isChecked ? styles["checked-row"] : ""}>
      <td className={setStyles["cell-wrapper"]}>
        <span className={setStyles["set-index"]}>{props.setIndex}</span>
        <button
          className={setStyles["remove-button"]}
          onClick={() => props.setRemover(props.setIndex - 1)}
        >
          <RemoveIcon />
        </button>
      </td>
      <td>{props.previos}</td>
      <td>{props.kg}</td>
      <td>{props.reps}</td>
      <td className={styles["checkbox-container"]}>
        <input type="checkbox" onChange={onCheck} />
        <CheckBoxIcon checkState={isChecked} />
      </td>
    </tr>
  );
};

export default Set;
