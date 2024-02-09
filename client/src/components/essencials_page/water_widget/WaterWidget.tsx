import styles from "./WaterWidget.module.css";

import waterDrop from "../../../assets/images/water_drop.png";

const WaterWidget = function () {
  return (
    <div className={styles.widget}>
      <div className={styles["icon-slot"]}>
        <img alt="Water Cup Icon" src={waterDrop} />
      </div>
      <div className={styles.controlls}>
        <div className={styles.display}>
          <h5>
            <span> 2 </span>/8
          </h5>
          <h6>Glass Water (250 ml.)</h6>
        </div>
        <div className={styles.buttons}>
          <button>-</button>
          <button>+</button>
        </div>
      </div>
    </div>
  );
};

export default WaterWidget;
