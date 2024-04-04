import { useState, useEffect } from "react";

import RouteButton from "./RouteButton";

import styles from "./PagesNavigation.module.css";

import WorkoutIcon from "../../../assets/svg_icon_components/WorkoutIcon";
import HealthEssenscialsIcon from "../../../assets/svg_icon_components/HealthEssensialsIcon";
import ExploreIcon from "../../../assets/svg_icon_components/ExploreIcon";
import StatisticsIcon from "../../../assets/svg_icon_components/StatisticsIcon";

const PagesNavigation = () => {
  return (
    <ul className={styles.wrapper}>
      <RouteButton path="dashboard" icon={<WorkoutIcon />} />
      <RouteButton path="health-essentials" icon={<HealthEssenscialsIcon />} />
      <RouteButton path="explore" icon={<ExploreIcon />} />
      <RouteButton path="statistics" icon={<StatisticsIcon />} />
    </ul>
  );
};

export default PagesNavigation;
