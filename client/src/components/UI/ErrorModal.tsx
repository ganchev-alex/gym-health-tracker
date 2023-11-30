import React from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "react-router-dom";

import { RootState } from "../../features/store";
import { changeVisibility } from "../../features/error-module";

import styles from "./ErrorModal.module.css";

type ModalOverlayProperties = {
  responseCode: number;
  title: string;
  details: string;
  label: string;
  redirectionRoute: string;
};

const Backdrop: React.FC = function () {
  return <div className={styles.backdrop} />;
};

const ModalOverlay: React.FC<{
  properties: ModalOverlayProperties;
}> = function (props) {
  const dispatch = useDispatch();
  const { responseCode, title, details, label, redirectionRoute } =
    props.properties;

  const selectedTheme = useSelector((state: RootState) => {
    return state.userActions.personalDetails.sex;
  });

  const classes = `${styles.modal} ${
    selectedTheme === "male" ? styles.male : styles.female
  }`;

  const clickHandler = function () {
    redirect(redirectionRoute);
    dispatch(changeVisibility(false));
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
