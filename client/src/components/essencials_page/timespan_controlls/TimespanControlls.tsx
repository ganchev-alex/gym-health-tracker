import CalendarLeftArrowIcon from "../../../assets/svg_icon_components/CalendarLeftArrowIcon";
import CalendarRightArrowIcon from "../../../assets/svg_icon_components/CalendarRightArrowIcon";
import NextArrowIcon from "../../../assets/svg_icon_components/NextArrowIcon";
import styles from "./TimespanControlls.module.css";

const TimespanControlls = function () {
  return (
    <div className={styles.controlls}>
      <h4>
        <span>Daily Tracker:</span> Today's Activities
      </h4>
      <span className={styles.yesterday}>
        <button>
          <CalendarLeftArrowIcon />
        </button>
        <p>Yesterday</p>
      </span>
    </div>
  );
};

export default TimespanControlls;
