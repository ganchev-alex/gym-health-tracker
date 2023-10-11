import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

import PagesNavigation from "./PagesNavigation";
import ProfileSection from "./ProfileSection";
import BottomSettings from "./BottomSettings";

import styles from "./NavigationBar.module.css";

function NavigationBar() {
  const toggleState = useSelector(
    (state: RootState) => state.navigation.toggleState
  );

  return (
    <nav
      className={`${styles["navigation-bar"]} ${
        !toggleState ? styles.untoggled : ""
      }`}
    >
      <ProfileSection />
      <PagesNavigation />
      <BottomSettings />
    </nav>
  );
}

export default NavigationBar;
