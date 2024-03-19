import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../features/store";
import { toggleNavigation } from "../../../features/styles-manager-actions";

import { mainAPIPath } from "../../../App";

import styles from "./ProfileSection.module.css";

import ToggleIcon from "../../../assets/svg_icon_components/ToggleIcon";

const ProfileSection: React.FC = () => {
  const dispatch = useDispatch();

  const { loadedUserData: profileData, isMale } = useSelector(
    (state: RootState) => {
      return state.userActions;
    }
  );

  const toggleState = useSelector(
    (state: RootState) => state.styleManager.toggleState
  );

  const onToggle = function () {
    dispatch(toggleNavigation());
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles["toggle-parent"]}>
        <img
          className={styles["profile-picture"]}
          alt="Profile Picture"
          src={`${mainAPIPath}/${profileData.personalDetails.profilePicture}`}
        />
        <button
          className={`${
            isMale
              ? styles["toggle-button-male"]
              : styles["toggle-button-female"]
          } ${toggleState ? "" : styles.toggled}`}
          onClick={onToggle}
        >
          <ToggleIcon />
        </button>
      </div>
      <div
        className={`${styles["profile-label"]} ${
          toggleState ? styles.toggled : ""
        }`}
      >
        <h6>
          Hello, {profileData.personalDetails.firstName[0]}
          {profileData.personalDetails.lastName[0]}. 👋🏻
        </h6>
        <p>GymPal Member</p>
      </div>
    </div>
  );
};

export default ProfileSection;
