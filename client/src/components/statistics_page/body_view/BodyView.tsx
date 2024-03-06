import WeekDays from "./WeekDays";

import styles from "./BodyView.module.css";

const BodyView = function () {
  return (
    <div className={styles.wrapper}>
      <WeekDays />
      <img />
    </div>
  );
};

export default BodyView;
