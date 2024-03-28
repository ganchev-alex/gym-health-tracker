import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import RouteButton from "./RouteButton";

import styles from "./PagesNavigation.module.css";

import WorkoutIcon from "../../../assets/svg_icon_components/WorkoutIcon";
import HealthEssenscialsIcon from "../../../assets/svg_icon_components/HealthEssensialsIcon";
import ExploreIcon from "../../../assets/svg_icon_components/ExploreIcon";
import StatisticsIcon from "../../../assets/svg_icon_components/StatisticsIcon";

const PagesNavigation = () => {
  return (
    <ul className={styles.wrapper}>
      <RouteButton path="dashboard" label="Workouts" icon={<WorkoutIcon />} />
      <RouteButton
        path="health-essentials"
        label="Health Essentials"
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
