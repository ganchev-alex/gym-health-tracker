import React from "react";
import ReactDOM from "react-dom";

import styles from "./RedirectionModal.module.css";

const Backdrop = function () {
  return <div className={styles.backdrop} />;
};

const Redirection = function () {
  return (
    <div className={styles.modal}>
      <h5>Session Expired</h5>
      <p>Your session has expired. Please login again.</p>
      <p>You are being redirected...</p>
    </div>
  );
};

const RedirectionModal = function () {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<Redirection />, overlayRoot)}
    </React.Fragment>
  );
};

export default RedirectionModal;
