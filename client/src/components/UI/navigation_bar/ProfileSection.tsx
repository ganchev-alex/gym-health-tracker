import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../../features/store";

import { mainAPIPath } from "../../../App";

import styles from "./ProfileSection.module.css";

import ToggleIcon from "../../../assets/svg_icon_components/ToggleIcon";

const ProfileSection: React.FC = () => {
  const { loadedUserData: profileData, isMale } = useSelector(
    (state: RootState) => {
      return state.userActions;
    }
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles["toggle-parent"]}>
        <img
          className={styles["profile-picture"]}
          alt="Profile Picture"
          src={`${mainAPIPath}/${profileData.personalDetails.profilePicture}`}
        />
      </div>
    </div>
  );
};

export default ProfileSection;
