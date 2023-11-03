import { useState } from "react";

import CheckBoxIcon from "../../assets/svg_icon_components/CheckboxIcon";

import styles from "./SetsTable.module.css";

const Set: React.FC<{
  setIndex: number;
  previos: string;
  kg: number;
  reps: number;
}> = function (props) {
  const [isChecked, setIsChecked] = useState(false);

  const onCheck = function (event: React.ChangeEvent<HTMLInputElement>) {
    setIsChecked(event.target.checked);
  };

  return (
    <tr className={isChecked ? styles["checked-row"] : ""}>
      <td>{props.setIndex}</td>
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
