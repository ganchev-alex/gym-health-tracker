import React from "react";

import PagesNavigation from "./PagesNavigation";

import styles from "./NavigationBar.module.css";

function NavigationBar() {
  return (
    <nav className={styles["navigation-bar"]}>
      <PagesNavigation />
    </nav>
  );
}

export default NavigationBar;
