import WeekDays from "./WeekDays";

import styles from "./BodyView.module.css";
import BodyDisplay from "./BodyDisplay";

const BodyView = function () {
  return (
    <div className={styles.wrapper}>
      <WeekDays />
      <BodyDisplay />
    </div>
  );
};

export default BodyView;
