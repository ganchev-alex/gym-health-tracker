import React from "react";
import ReactDOM from "react-dom";

import styles from "./AccountManagement.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import {
  setAccountModalVisibility,
  setChoiceModalVisibility,
} from "../../../features/modals";
import { mainAPIPath } from "../../../App";
import { getToken } from "../../../util/auth";
import ChoiceModal from "../choice_modal/ChoiceModal";
import { setNotificationState } from "../../../features/workout-page-actions";
import { useNavigate } from "react-router-dom";

const Backdrop = function () {
  const dispatch = useDispatch();
  return (
    <div
      className={styles.backdrop}
      onClick={() => dispatch(setAccountModalVisibility(false))}
    />
  );
};

const AccountManagement = function () {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { verification } = useSelector(
    (state: RootState) => state.userActions.loadedUserData.auth
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);
  const { visibility } = useSelector(
    (state: RootState) => state.modalsManager.choiceModal
  );

  const sendVerificationEmail = async function () {
    try {
      const response = await fetch(
        `${mainAPIPath}/account/verification-email`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.ok) {
        dispatch(
          setNotificationState({
            visibility: true,
            message: "📬 Verification Email Sent!",
          })
        );
      } else {
        dispatch(
          setNotificationState({
            visibility: true,
            message: "📭📛 Email WAS NOT Sent!",
          })
        );
      }
    } catch (error) {
      dispatch(
        setNotificationState({
          visibility: true,
          message: "📭📛 Email WAS NOT Sent!",
        })
      );
    } finally {
      setTimeout(() => {
        dispatch(setNotificationState({ visibility: false }));
      }, 5000);
    }
  };

  const sendChangePasswordEmail = async function () {
    try {
      const response = await fetch(`${mainAPIPath}/account/password-email`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.ok) {
        dispatch(
          setNotificationState({
            visibility: true,
            message: "📬 Password Email Sent!",
          })
        );
      } else {
        dispatch(
          setNotificationState({
            visibility: true,
            message: "📭📛 Email WAS NOT Sent!",
          })
        );
      }
    } catch (error) {
      dispatch(
        setNotificationState({
          visibility: true,
          message: "📭📛 Email WAS NOT Sent!",
        })
      );
    } finally {
      setTimeout(() => {
        dispatch(setNotificationState({ visibility: false }));
      }, 5000);
    }
  };

  const sendDeleteAccountEmail = async function () {
    try {
      const response = await fetch(`${mainAPIPath}/account/delete-email`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (response.ok) {
        dispatch(
          setNotificationState({
            visibility: true,
            message: "📬 Delete Account Email Sent!",
          })
        );
      } else {
        dispatch(
          setNotificationState({
            visibility: true,
            message: "📭📛 Email WAS NOT Sent!",
          })
        );
      }
    } catch (error) {
      dispatch(
        setNotificationState({
          visibility: true,
          message: "📭📛 Email WAS NOT Sent!",
        })
      );
    } finally {
      setTimeout(() => {
        dispatch(setNotificationState({ visibility: false }));
      }, 5000);
    }
  };

  const changeEmail = function () {
    navigate("/auth/change-email");
  };

  return (
    <React.Fragment>
      {visibility && (
        <ChoiceModal
          message="Delete your account?"
          description="Are you sure you want to proceed with the deletion of your account? All your data will be lost and you won't be able to retrive it back."
          noButtonLable="Cancel"
          yesButtonLable="Proceed Deletion"
          acceptAction={sendDeleteAccountEmail}
        />
      )}
      <div className={styles.modal}>
        <h4>Account Management</h4>
        {!verification && (
          <div className={styles.verify}>
            <p>
              Your email is still not verified! To be able to access your
              account management functionallity verify your email first.
            </p>
            <button onClick={sendVerificationEmail}>Verify Email</button>
          </div>
        )}
        <button
          className={`${verification ? "" : styles.disabled}`}
          disabled={!verification}
          style={isMale ? { backgroundColor: "#472ED8" } : undefined}
          onClick={changeEmail}
        >
          Change Email
        </button>
        <button
          className={`${verification ? "" : styles.disabled}`}
          disabled={!verification}
          style={isMale ? { backgroundColor: "#472ED8" } : undefined}
          onClick={sendChangePasswordEmail}
        >
          Change Password
        </button>
        <button
          className={`${styles.delete} ${verification ? "" : styles.disabled}`}
          disabled={!verification}
          onClick={() => dispatch(setChoiceModalVisibility(true))}
        >
          Delete Account
        </button>
        <button
          className={styles.close}
          style={
            isMale ? { color: "#472ED8", borderColor: "#472ED8" } : undefined
          }
          onClick={() => dispatch(setAccountModalVisibility(false))}
        >
          Close
        </button>
      </div>
    </React.Fragment>
  );
};

const AccountManagementModal = function () {
  const backdropRoot = document.getElementById("backdrop-root");
  const overlayRoot = document.getElementById("overlay-root");
  if (!backdropRoot || !overlayRoot) {
    return null;
  }
  return (
    <React.Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropRoot)}
      {ReactDOM.createPortal(<AccountManagement />, overlayRoot)}
    </React.Fragment>
  );
};

export default AccountManagementModal;
