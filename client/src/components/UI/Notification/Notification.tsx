import React from "react";

import styles from "./Notification.module.css";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import { setNotificationState } from "../../../features/widgets-actions";

const Notification: React.FC<{ message: string }> = function (props) {
  const dispatch = useDispatch();
  return (
    <div className={styles.container}>
      <p>{props.message}</p>
      <button
        onClick={() => dispatch(setNotificationState({ visibility: false }))}
      >
        x
      </button>
    </div>
  );
};

const NotificationBar = function () {
  const overlayRoot = document.getElementById("overlay-root");
  const message = useSelector((state: RootState) => {
    return state.widgetsManager.notificationManager.message;
  });
  if (overlayRoot)
    return (
      <React.Fragment>
        {createPortal(<Notification message={message || ""} />, overlayRoot)}
      </React.Fragment>
    );
  else {
    return null;
  }
};

export default NotificationBar;
