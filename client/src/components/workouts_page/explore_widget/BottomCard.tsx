import { Link } from "react-router-dom";
import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";
import { secondsConverter } from "../../essencials_page/activities_widget/ActivitiesWidget";

import styles from "./BottomCard.module.css";
import { useDispatch } from "react-redux";
import { setExplorePreviewVisibility } from "../../../features/styles-manager-actions";

const BottomCard: React.FC<{
  _id: string;
  category: string;
  duration: number;
}> = function (props) {
  const dispatch = useDispatch();

  return (
    <div className={styles["bottom-wrapper"]}>
      <span className={styles["time-wrapper"]}>
        <TimerIcon />
        <p>{secondsConverter(props.duration)}</p>
      </span>
      <p className={styles.category}>{props.category}</p>
      <Link
        to={`/app/explore/${props._id}`}
        onClick={() => {
          dispatch(setExplorePreviewVisibility(true));
        }}
      >
        Learn More
      </Link>
    </div>
  );
};

export default BottomCard;
