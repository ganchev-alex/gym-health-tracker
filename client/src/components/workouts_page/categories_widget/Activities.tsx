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
      <ActivityButton mode="RUN" icon=<RunningIcon /> />
      <ActivityButton mode="BIKE" icon=<ByciclingIcon /> />
      <ActivityButton mode="MEDITATE" icon=<MeditationIcon /> />
      <ActivityButton mode="SWIM" icon=<SwimmingIcon /> />
      <ActivityButton mode="WALK" icon=<WalkingIcon /> />
    </div>
  );
};

export default Activities;
