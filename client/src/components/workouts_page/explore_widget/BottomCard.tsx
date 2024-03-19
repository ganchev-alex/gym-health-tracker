import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setExplorePreviewVisibility } from "../../../features/styles-manager-actions";

import { secondsConverter } from "../../essencials_page/activities_widget/ActivitiesWidget";

import styles from "./BottomCard.module.css";

import TimerIcon from "../../../assets/svg_icon_components/TimerIcon";
import { RootState } from "../../../features/store";

const BottomCard: React.FC<{
  _id: string;
  category: string;
  duration: number;
}> = function (props) {
  const dispatch = useDispatch();

  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <div className={styles["bottom-wrapper"]}>
      <span
        className={styles["time-wrapper"]}
        style={isMale ? { backgroundColor: "#472ED8" } : undefined}
      >
        <TimerIcon />
        <p>{secondsConverter(props.duration)}</p>
      </span>
      <p
        className={styles.category}
        style={isMale ? { color: "#472ED8" } : undefined}
      >
        {props.category}
      </p>
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
