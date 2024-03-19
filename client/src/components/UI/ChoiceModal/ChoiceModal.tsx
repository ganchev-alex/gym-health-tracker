import React from "react";
import ReactDOM from "react-dom";
import { Backdrop } from "../ErrorModal/ErrorModal";

import styles from "./ChoiceModal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setChoiceModalVisibility } from "../../../features/modals";
import { setRoutineOptionsState } from "../../../features/workout-page-actions";
import { RootState } from "../../../features/store";

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

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const onCloseModal = function () {
    dispatch(setChoiceModalVisibility(false));
    dispatch(setRoutineOptionsState({ visibility: false }));
  };

  return (
    <div className={styles.modal}>
      <h6>{props.properties.message}</h6>
      <p>{props.properties.description || ""}</p>
      <div className={styles.buttons}>
        <button
          onClick={onCloseModal}
          style={
            isMale ? { color: "#472ed8", borderColor: "#472ed8" } : undefined
          }
        >
          {props.properties.noButtonLable}
        </button>
        <button
          onClick={() => {
            props.properties.acceptAction();
            onCloseModal();
          }}
          style={
            isMale
              ? { backgroundColor: "#472ed8", borderColor: "#472ed8" }
              : undefined
          }
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
