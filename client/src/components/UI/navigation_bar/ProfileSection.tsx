import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../../features/store";

import { mainAPIPath } from "../../../App";

import styles from "./ProfileSection.module.css";

import backUpSrc from "../../../assets/images/default_profile.png";

const ProfileSection: React.FC = () => {
  const { loadedUserData: profileData } = useSelector((state: RootState) => {
    return state.userActions;
  });

  return (
    <div className={styles.wrapper}>
      <div style={{ backgroundImage: backUpSrc, borderRadius: "50%" }}>
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
