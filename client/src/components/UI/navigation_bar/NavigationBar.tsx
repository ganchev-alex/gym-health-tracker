import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import PagesNavigation from "./PagesNavigation";
import ProfileSection from "./ProfileSection";
import BottomSettings from "./BottomSettings";

import styles from "./NavigationBar.module.css";

function NavigationBar() {
  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <nav
      className={styles["navigation-bar"]}
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
