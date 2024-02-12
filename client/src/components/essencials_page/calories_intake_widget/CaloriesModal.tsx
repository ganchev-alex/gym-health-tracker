import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";

import styles from "./CaloriesModal.module.css";

const Backdrop: React.FC<{ onClose: () => void }> = function (props) {
  return <div className={styles.backdrop} onClick={props.onClose} />;
};

const CaloriesForm: React.FC<{
  onAdd: (calories: number, meal: string) => void;
  onClose: () => void;
}> = function (props) {
  const [selectedMeal, setSelectedMeal] = useState("");
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    const currentTime = new Date().getHours();

    let defaultOption;
    if (currentTime < 11) {
      defaultOption = "Breakfast";
    } else if (currentTime < 13) {
      defaultOption = "Morning Snack";
    } else if (currentTime < 15) {
      defaultOption = "Lunch";
    } else if (currentTime < 17) {
      defaultOption = "Afternoon Snack";
    } else if (currentTime < 19) {
      defaultOption = "Dinner";
    } else {
      defaultOption = "Evening Snack";
    }

    setSelectedMeal(defaultOption);
  }, []);

  return (
    <div className={styles.modal}>
      <h6>Calories Intake</h6>
      <div className={styles.inputs}>
        <select
          value={selectedMeal}
          onChange={(event) => setSelectedMeal(event.target.value)}
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Morning Snack">Morning Snack</option>
          <option value="Afternoon Snack">Afternoon Snack</option>
          <option value="Evening Snack">Evening Snack</option>
        </select>
        <span>
          <input
            type="number"
            value={calories}
            id="calories"
            placeholder="Calories"
            onChange={(event) => setCalories(parseInt(event.target.value))}
          />
          <label htmlFor="calories">cal. </label>
        </span>
      </div>
      <div className={styles.buttons}>
        <button onClick={props.onClose}>Cancel</button>
        <button onClick={() => props.onAdd(calories, selectedMeal)}>
          + Add
        </button>
      </div>
    </div>
  );
};

const CaloriesModal: React.FC<{
  onAdd: (calories: number, meal: string) => void;
  onClose: () => void;
}> = function (props) {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        backdropRoot
      )}
      {ReactDOM.createPortal(
        <CaloriesForm onAdd={props.onAdd} onClose={props.onClose} />,
        overlayRoot
      )}
    </React.Fragment>
  );
};

export default CaloriesModal;
