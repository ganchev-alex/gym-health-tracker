import styles from "./CaloriesIntakeWidget.module.css";

import caloriesIntake from "../../../assets/images/calories_intake.png";

const CaloriesIntakeWidget = function () {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <span className={styles["icon-slot"]}>
          <img alt="Calories Intake" src={caloriesIntake} />
        </span>
        <h5>
          Total calaroies: <span>1503</span>
        </h5>
      </div>
      <div className={styles.controll}>
        <input type="number" placeholder="Calories" />
        <button type="submit">+ Add</button>
      </div>
      <div className={styles.history}>
        <h6>Portions: </h6>
        <ul>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
          <li>
            <span>Meal 4:30 pm: </span>645 cal.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CaloriesIntakeWidget;
