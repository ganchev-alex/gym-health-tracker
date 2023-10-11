import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

// Components
import RouteButton from "./RouteButton";

// CSS Modules
import styles from "./PagesNavigation.module.css";

// Assets
import DashboardIcon from "../../assets/svg_icon_components/DashboardIcon";
import WorkoutIcon from "../../assets/svg_icon_components/WorkoutIcon";
import HealthEssenscialsIcon from "../../assets/svg_icon_components/HealthEssensialsIcon";
import ExploreIcon from "../../assets/svg_icon_components/ExploreIcon";
import StatisticsIcon from "../../assets/svg_icon_components/Statistics";

const PagesNavigation = () => {
  const toggleState = useSelector(
    (state: RootState) => state.navigation.toggleState
  );

  return (
    <ul className={`${!toggleState ? styles.untoggled : ""}`}>
      <RouteButton
        path="dashboard"
        label="Dashboard"
        icon={<DashboardIcon />}
      />
      <RouteButton path="workouts" label="Workouts" icon={<WorkoutIcon />} />
      <RouteButton
        path="health-essencials"
        label="Health Essencials"
        icon={<HealthEssenscialsIcon />}
      />
      <RouteButton path="explore" label="Explore" icon={<ExploreIcon />} />
      <RouteButton
        path="statistics"
        label="Statistics"
        icon={<StatisticsIcon />}
      />
    </ul>
  );
};

export default PagesNavigation;
