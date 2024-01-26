import { useDispatch } from "react-redux";
import styles from "./WorkoutsButton.module.css";
import { setFormVisibility } from "../../../features/widgets-actions";

const WorkoutsButton: React.FC = () => {
  const dispatch = useDispatch();

  const createNewRoutine = function () {
    dispatch(setFormVisibility(true));
  };

  return (
    <div className={styles["button-holder"]}>
      <button className={styles["main-button"]}>Start Empty Workout</button>
      <button className={styles["secondary-button"]} onClick={createNewRoutine}>
        New Routine
      </button>
    </div>
  );
};

export default WorkoutsButton;
