import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import RouteButton from "./RouteButton";

import styles from "./PagesNavigation.module.css";

import WorkoutIcon from "../../../assets/svg_icon_components/WorkoutIcon";
import HealthEssenscialsIcon from "../../../assets/svg_icon_components/HealthEssensialsIcon";
import ExploreIcon from "../../../assets/svg_icon_components/ExploreIcon";
import StatisticsIcon from "../../../assets/svg_icon_components/StatisticsIcon";

const PagesNavigation = () => {
  const toggleState = useSelector(
    (state: RootState) => state.styleManager.toggleState
  );

  return (
    <ul
      className={`${styles.wrapper} ${!toggleState ? styles.untoggled : ""} `}
    >
      <RouteButton path="dashboard" label="Workouts" icon={<WorkoutIcon />} />
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
