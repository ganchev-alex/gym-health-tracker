import React from "react";

import LogOutIcon from "../../../assets/svg_icon_components/LogOutIcon";
import ThemeIcon from "../../../assets/svg_icon_components/ThemeIcon";

import styles from "./BottomSettings.module.css";
import { useState } from "react";
import ChoiceModal from "../ChoiceModal/ChoiceModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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
            localStorage.removeItem("token");
            localStorage.removeItem("expiration");
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
          <button className={styles["theme-button"]}>
            <ThemeIcon selectedTheme={true} />
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
