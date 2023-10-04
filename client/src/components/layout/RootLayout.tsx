import { Outlet } from "react-router-dom";

import NavigationBar from "../navigation_bar/NavigationBar";

import styles from "./RootLayout.module.css";

function RootLayout() {
  return (
    <div className={styles["content-wrapper"]}>
      <NavigationBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
