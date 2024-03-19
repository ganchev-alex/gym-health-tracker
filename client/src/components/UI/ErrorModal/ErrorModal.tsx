import React from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../features/store";
import { setErrorModalVisibility } from "../../../features/modals";

import styles from "./ErrorModal.module.css";
import { restoreRoutinesWidgetInitialState } from "../../../features/workout-page-actions";

type ModalOverlayProperties = {
  responseCode: number;
  title: string;
  details: string;
  label: string;
  redirectionRoute: string;
};

export const Backdrop: React.FC = function () {
  return <div className={styles.backdrop} />;
};

const ModalOverlay: React.FC<{
  properties: ModalOverlayProperties;
}> = function (props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { responseCode, title, details, label, redirectionRoute } =
    props.properties;

  const { isMale } = useSelector((state: RootState) => state.userActions);
  const presavedSex = localStorage.getItem("userSex");

  let classes;
  if (presavedSex) {
    classes = `${styles.modal} ${
      presavedSex === "male" ? styles.male : styles.female
    }`;
  } else {
    classes = `${styles.modal} ${isMale ? styles.male : styles.female}`;
  }

  const clickHandler = function () {
    if (redirectionRoute.includes("/auth")) {
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
    }
    navigate(redirectionRoute);
    dispatch(setErrorModalVisibility(false));
    dispatch(restoreRoutinesWidgetInitialState());
  };

  return (
    <div className={classes}>
      <h4>
        {responseCode}. {title}
      </h4>
      <p>{details}</p>
      <footer>
        <button onClick={clickHandler}>{label}</button>
      </footer>
    </div>
  );
};

const ErrorModal: React.FC<{ properties: ModalOverlayProperties }> = function (
  props
) {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(
        <ModalOverlay properties={props.properties} />,
        overlayRoot
      )}
    </React.Fragment>
  );
};

export default ErrorModal;
