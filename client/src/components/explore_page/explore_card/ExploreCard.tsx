import { useNavigate } from "react-router-dom";
import { ExploreCardsI } from "../../../features/explore-actions";
import { secondsConverter } from "../../essencials_page/activities_widget/ActivitiesWidget";
import styles from "./ExploreCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setExplorePreviewVisibility } from "../../../features/styles-manager-actions";
import { RootState } from "../../../features/store";

const ExploreCard: React.FC<ExploreCardsI> = function (props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const onCardRedirect = function () {
    dispatch(setExplorePreviewVisibility(true));
    navigate(`/app/explore/${props._id}`);
  };

  return (
    <div className={styles.card} onClick={onCardRedirect}>
      <img src={props.image} alt="Workout Tumbnail" />
      <div className={styles.description}>
        <h6>{props.title}</h6>
        <span>
          <p style={isMale ? { color: "#472ED8" } : undefined}>
            {props.category}
          </p>
          <p>Duration: {secondsConverter(props.duration)}</p>
        </span>
      </div>
    </div>
  );
};

export default ExploreCard;
