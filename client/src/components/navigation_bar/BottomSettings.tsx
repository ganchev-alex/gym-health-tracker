import LogOutIcon from "../../assets/svg_icon_components/LogOutIcon";
import ThemeIcon from "../../assets/svg_icon_components/ThemeIcon";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../features/store";
import { toggle } from "../../features/styles-manager-actions";

import styles from "./BottomSettings.module.css";

function BottomSettings() {
  const toggleState = useSelector(
    (state: RootState) => state.navigation.toggleState
  );
  const dispatch = useDispatch();

  const onToggle = function () {
    dispatch(toggle());
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles["set-wrapper"]}>
        <button className={styles["theme-button"]}>
          <ThemeIcon selectedTheme={true} />
        </button>
        {toggleState ? null : <span className={styles.label}>Light Mode</span>}
      </div>
      <div className={styles["set-wrapper"]}>
        <button className={styles["logout-button"]}>
          <LogOutIcon />
        </button>
        {toggleState ? null : <span className={styles.label}>Log Out</span>}
      </div>
    </div>
  );
}

export default BottomSettings;
