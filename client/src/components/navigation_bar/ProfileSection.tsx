import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../features/store";
import { toggle } from "../../features/styles-manager-actions";

import ToggleIcon from "../../assets/svg_icon_components/ToggleIcon";

import styles from "./ProfileSection.module.css";

const ProfileSection: React.FC = () => {
  const toggleState = useSelector(
    (state: RootState) => state.navigation.toggleState
  );
  const dispatch = useDispatch();

  const onToggle = function () {
    dispatch(toggle());
  };

  return (
    <div className={styles.wrapper}>
      <img
        className={styles["profile-picture"]}
        alt="Profile Picture"
        src="https://images.unsplash.com/photo-1540174401473-df5f1c06c716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
      />
      <button
        className={`${styles["toggle-button"]} ${
          toggleState ? "" : styles.toggled
        }`}
        onClick={onToggle}
      >
        <ToggleIcon />
      </button>
      <div
        className={`${styles["profile-label"]} ${
          toggleState ? styles.toggled : ""
        }`}
      >
        <h6>Hello, Megan! 👋🏻</h6>
        <p>megan.mail@gmail.com</p>
      </div>
    </div>
  );
};

export default ProfileSection;
