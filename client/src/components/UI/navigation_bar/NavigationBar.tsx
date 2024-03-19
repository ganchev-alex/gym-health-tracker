import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import PagesNavigation from "./PagesNavigation";
import ProfileSection from "./ProfileSection";
import BottomSettings from "./BottomSettings";

import styles from "./NavigationBar.module.css";

function NavigationBar() {
  const { isMale } = useSelector((state: RootState) => state.userActions);
  const toggleState = useSelector(
    (state: RootState) => state.styleManager.toggleState
  );

  return (
    <nav
      className={`${styles["navigation-bar"]} ${
        !toggleState ? styles.untoggled : ""
      }`}
      style={
        isMale
          ? { backgroundImage: "linear-gradient(45deg, #29156b, #472ed8)" }
          : undefined
      }
    >
      <ProfileSection />
      <PagesNavigation />
      <BottomSettings />
    </nav>
  );
}

export default NavigationBar;
