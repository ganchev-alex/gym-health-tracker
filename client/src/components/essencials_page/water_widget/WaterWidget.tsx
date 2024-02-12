import styles from "./WaterWidget.module.css";

import waterDrop from "../../../assets/images/water_drop.png";
import { useDispatch, useSelector } from "react-redux";
import { modifyWaterIntake } from "../../../features/health-essentials-actions";
import { RootState } from "../../../features/store";

const WaterWidget = function () {
  const dispatch = useDispatch();
  const waterAmount = useSelector((state: RootState) => {
    return state.healthEssentials.isToday
      ? state.healthEssentials.today.water
      : state.healthEssentials.yesterday.water;
  });

  const suggestedLiters = useSelector((state: RootState) => {
    return state.healthEssentials.targets.waterTarget;
  });

  return (
    <div className={styles.widget}>
      <div className={styles["icon-slot"]}>
        <img alt="Water Cup Icon" src={waterDrop} />
      </div>
      <div className={styles.controlls}>
        <div className={styles.display}>
          <h5>
            <span
              style={
                waterAmount >= suggestedLiters
                  ? { color: "#5db9ed" }
                  : undefined
              }
            >
              {waterAmount / 250}
            </span>{" "}
            / {suggestedLiters / 250}
          </h5>
          <h6>Glass Water (250 ml.)</h6>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={() => {
              dispatch(modifyWaterIntake(false));
            }}
          >
            -
          </button>
          <button
            onClick={() => {
              dispatch(modifyWaterIntake(true));
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaterWidget;
