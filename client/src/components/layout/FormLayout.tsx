import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../features/store";
import { deleteToken, getExpiryRate, getToken } from "../../util/auth";

import styles from "./FormLayout.module.css";

import ErrorModal from "../UI/ErrorModal/ErrorModal";

import maleBackground from "../../assets/images/male_background_signin_form.jpg";
import femaleBackground from "../../assets/images/female_background_signin_form.jpg";
import LoadingPlane from "../UI/LoadingPlane/LoadingPlane";

const FormLayout: React.FC = function () {
  const token = getToken();
  useEffect(() => {
    const expiryRate = getExpiryRate();
    setTimeout(() => {
      deleteToken();
    }, expiryRate);
  }, [token]);

  const selectedMode = useSelector((state: RootState) => state.userActions.sex);
  const styleChecker = localStorage.getItem("userSex") || selectedMode;

  const loadingState = useSelector(
    (state: RootState) => state.loadingManager.isLoading
  );

  const errorModalState = useSelector(
    (state: RootState) => state.modalsManager.errorModal
  );

  const mainClasses = `${styles["wrapper"]} ${
    styleChecker === "male" ? styles.male : styles.female
  }`;

  const selectedGradient = `${
    styleChecker === "male"
      ? styles["male-gradient"]
      : styles["female-gradient"]
  }`;

  return (
    <main className={mainClasses}>
      {errorModalState.visibility && (
        <ErrorModal properties={errorModalState} />
      )}
      <div className={styles["image-slot"]}>
        <img
          src={maleBackground}
          className={styleChecker == "male" ? "" : styles.hidden}
        />
        <img
          src={femaleBackground}
          className={styleChecker == "female" ? "" : styles.hidden}
        />
        <div className={selectedGradient} />
      </div>
      <div className={styles["form-holder"]}>
        {loadingState && <LoadingPlane />}
        <Outlet />
      </div>
    </main>
  );
};

export default FormLayout;
