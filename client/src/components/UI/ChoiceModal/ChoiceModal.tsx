import React from "react";
import ReactDOM from "react-dom";
import { Backdrop } from "../ErrorModal/ErrorModal";

import styles from "./ChoiceModal.module.css";
import { useDispatch } from "react-redux";
import { changeChoiceModalVisibility } from "../../../features/modals";
import { setRoutineOptionsState } from "../../../features/workout-page-actions";

const ModalOverlay: React.FC<{
  properties: {
    message: string;
    description?: string;
    noButtonLable: string;
    yesButtonLable: string;
    acceptAction: () => void;
  };
}> = function (props) {
  const dispatch = useDispatch();

  const onCloseModal = function () {
    dispatch(changeChoiceModalVisibility(false));
    dispatch(setRoutineOptionsState({ visibility: false }));
  };

  return (
    <div className={styles.modal}>
      <h6>{props.properties.message}</h6>
      <p>{props.properties.description || ""}</p>
      <div className={styles.buttons}>
        <button onClick={onCloseModal}>{props.properties.noButtonLable}</button>
        <button
          onClick={() => {
            props.properties.acceptAction();
            onCloseModal();
          }}
        >
          {props.properties.yesButtonLable}
        </button>
      </div>
    </div>
  );
};

const ChoiceModal: React.FC<{
  message: string;
  description?: string;
  noButtonLable: string;
  yesButtonLable: string;
  acceptAction: () => void;
}> = function (props) {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");

  if (!backdropRoot || !overlayRoot) {
    return null!;
  }

  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<ModalOverlay properties={props} />, overlayRoot)}
    </React.Fragment>
  );
};

export default ChoiceModal;
