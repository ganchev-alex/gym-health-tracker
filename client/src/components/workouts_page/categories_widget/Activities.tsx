import React from "react";

import ActivityButton from "./ActivityButton";

import styles from "./Activities.module.css";

import RunningIcon from "../../../assets/svg_icon_components/RunningIcon";
import ByciclingIcon from "../../../assets/svg_icon_components/ByciclingIcon";
import MeditationIcon from "../../../assets/svg_icon_components/MeditationIcon";
import SwimmingIcon from "../../../assets/svg_icon_components/SwimmingIcon";
import WalkingIcon from "../../../assets/svg_icon_components/WalkingIcon";

const Activities: React.FC = () => {
  return (
    <div className={styles["buttons-holder"]}>
      <ActivityButton icon=<RunningIcon /> />
      <ActivityButton icon=<ByciclingIcon /> />
      <ActivityButton icon=<MeditationIcon /> />
      <ActivityButton icon=<SwimmingIcon /> />
      <ActivityButton icon=<WalkingIcon /> />
    </div>
  );
};

export default Activities;
