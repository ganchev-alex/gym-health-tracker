import styles from "./CaloriesIntakeWidget.module.css";

import caloriesIntake from "../../../assets/images/calories_intake.png";
import React, { useState } from "react";
import CaloriesModal from "./CaloriesModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import { appendCaloriesHistory } from "../../../features/health-essentials-actions";

const CaloriesIntakeWidget = function () {
  const dispatch = useDispatch();
  const [formVisibility, setFormVisibility] = useState(false);
  const calHistory = useSelector((state: RootState) =>
    state.healthEssentials.isToday
      ? state.healthEssentials.today.calHistory
      : state.healthEssentials.yesterday.calHistory
  );

  const totalCalories = useSelector((state: RootState) =>
    state.healthEssentials.isToday
      ? state.healthEssentials.today.consumedCalories
      : state.healthEssentials.yesterday.consumedCalories
  );

  const addHandler = function (calories: number, meal: string) {
    dispatch(appendCaloriesHistory({ calories, meal }));
    setFormVisibility(false);
  };

  const closeHandler = function () {
    setFormVisibility(false);
  };

  return (
    <React.Fragment>
      {formVisibility && (
        <CaloriesModal onAdd={addHandler} onClose={closeHandler} />
      )}
      <div className={styles.widget}>
        <div className={styles.header}>
          <span className={styles["icon-slot"]}>
            <img alt="Calories Intake" src={caloriesIntake} />
          </span>
          <h5>
            Total calaroies: <span>{totalCalories}</span>
          </h5>
        </div>
        <div className={styles.history}>
          {calHistory.length > 0 ? (
            <React.Fragment>
              <h6>Meals and Calories</h6>
              <ul>
                {calHistory.map((record, index) => {
                  return (
                    <li key={index}>
                      <span>
                        {record.timespan} - {record.meal}:{" "}
                      </span>
                      {record.calories}
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          ) : (
            <p>
              Track your calories intake
              <br /> by adding your meals <br />
              through out the day!
            </p>
          )}
        </div>
        <button type="submit" onClick={() => setFormVisibility(true)}>
          + Add
        </button>
      </div>
    </React.Fragment>
  );
};

export default CaloriesIntakeWidget;
