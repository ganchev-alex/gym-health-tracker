import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../features/store";
import { toggleNavigation } from "../../../features/styles-manager-actions";

import ToggleIcon from "../../../assets/svg_icon_components/ToggleIcon";

import styles from "./ProfileSection.module.css";
import { mainAPIPath } from "../../../App";

const ProfileSection: React.FC = () => {
  const dispatch = useDispatch();

  const profileData = useSelector((state: RootState) => {
    return state.userActions.loadedUserData;
  });

  const toggleState = useSelector(
    (state: RootState) => state.styleManager.toggleState
  );

  const onToggle = function () {
    dispatch(toggleNavigation());
  };

  return (
    <div className={styles.wrapper}>
      <img
        className={styles["profile-picture"]}
        alt="Profile Picture"
        src={`${mainAPIPath}/${profileData.personalDetails.profilePicture}`}
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
        <h6>Hello, {profileData.personalDetails.firstName[0]}. 👋🏻</h6>
        <p>{profileData.email}</p>
      </div>
    </div>
  );
};

export default ProfileSection;
