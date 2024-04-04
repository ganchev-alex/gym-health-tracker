import React from "react";

import LogOutIcon from "../../../assets/svg_icon_components/LogOutIcon";
import AccountIcon from "../../../assets/svg_icon_components/AccountIcon";

import styles from "./BottomSettings.module.css";
import { useState } from "react";
import ChoiceModal from "../choice_modal/ChoiceModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccountModalVisibility } from "../../../features/modals";
import { deleteToken } from "../../../util/auth";

function BottomSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [localVisibility, setLocalVisibility] = useState(false);

  return (
    <React.Fragment>
      {localVisibility && (
        <ChoiceModal
          message="Log Out?"
          description="Are you sure you want to log out of the applicaton?"
          noButtonLable="Cancel"
          yesButtonLable="Log Out"
          acceptAction={() => {
            deleteToken();
            navigate("/auth/login");
            window.location.reload();
          }}
          declineActionModification={() => {
            setLocalVisibility(false);
          }}
        />
      )}
      <div className={styles.wrapper}>
        <div className={styles["set-wrapper"]}>
          <button
            className={styles["account-button"]}
            onClick={() => {
              dispatch(setAccountModalVisibility(true));
            }}
          >
            <AccountIcon />
          </button>
        </div>
        <div className={styles["set-wrapper"]}>
          <button
            className={styles["logout-button"]}
            onClick={() => setLocalVisibility(true)}
          >
            <LogOutIcon />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default BottomSettings;
