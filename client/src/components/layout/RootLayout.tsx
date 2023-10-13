import { Outlet } from "react-router-dom";

import NavigationBar from "../navigation_bar/NavigationBar";

import styles from "./RootLayout.module.css";

function RootLayout() {
  return (
    <div className={styles["content-wrapper"]}>
      <NavigationBar />
      <main>
        <h1>Welcome Back, Megan!</h1>
        <h3>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h3>
        <Outlet />
      </main>
      {/* Add another side bar component for achievments here.*/}
    </div>
  );
}

export default RootLayout;
