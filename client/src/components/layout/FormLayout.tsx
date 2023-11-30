import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../features/store";

import styles from "./FormLayout.module.css";

import ErrorModal from "../UI/ErrorModal";

import LoadingSpinner from "../../assets/svg_icon_components/LoadingSpinner";
import maleBackground from "../../assets/images/male_background_signin_form.jpg";
import femaleBackground from "../../assets/images/female_background_signin_form.jpg";

const FormLayout: React.FC = function () {
  const selectedMode = useSelector(
    (state: RootState) => state.userActions.personalDetails.sex
  );

  const loadingState = useSelector(
    (state: RootState) => state.loadingManager.isLoading
  );

  const errorState = useSelector(
    (state: RootState) => state.errorModuleManager
  );

  const mainClasses = `${styles["wrapper"]} ${
    selectedMode === "male" ? styles.male : styles.female
  }`;

  const selectedGradient = `${
    selectedMode === "male"
      ? styles["male-gradient"]
      : styles["female-gradient"]
  }`;

  return (
    <main className={mainClasses}>
      {errorState.isShown && <ErrorModal properties={errorState.moduleData} />}
      <div className={styles["image-slot"]}>
        <img
          src={maleBackground}
          className={selectedMode == "male" ? "" : styles.hidden}
        />
        <img
          src={femaleBackground}
          className={selectedMode == "female" ? "" : styles.hidden}
        />
        <div className={selectedGradient} />
      </div>
      <div className={styles["form-holder"]}>
        {loadingState && (
          <div className={styles["loading-plane"]}>
            <LoadingSpinner />
          </div>
        )}
        <Outlet />
      </div>
    </main>
  );
};

export default FormLayout;
