import LoadingSpinner from "../../../assets/svg_icon_components/LoadingSpinner";

import styles from "./LoadingPlane.module.css";

const LoadingPlane = function () {
  return (
    <div className={styles.plane}>
      <LoadingSpinner />
    </div>
  );
};

export default LoadingPlane;
