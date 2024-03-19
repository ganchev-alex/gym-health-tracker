import React from "react";
import ReactDOM from "react-dom";
import styles from "./HelpModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setHelpModalState } from "../../../features/modals";
import { RootState } from "../../../features/store";

const Backdrop = function () {
  const dispatch = useDispatch();
  return (
    <div
      className={styles.backdrop}
      onClick={() => dispatch(setHelpModalState({ visibility: false }))}
    />
  );
};

const Help = function () {
  const dispatch = useDispatch();
  const tip = useSelector(
    (state: RootState) => state.modalsManager.helpModal.tip
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <div className={styles.modal}>
      <p>{tip}</p>
      <button
        onClick={() => dispatch(setHelpModalState({ visibility: false }))}
        style={isMale ? { color: "#472ED8" } : undefined}
      >
        OK
      </button>
    </div>
  );
};

const HelpModal = function () {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<Help />, overlayRoot)}
    </React.Fragment>
  );
};

export default HelpModal;
