import { useDispatch, useSelector } from "react-redux";
import styles from "./RelatedCard.module.css";
import { setExplorePreviewVisibility } from "../../../features/styles-manager-actions";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../features/store";

const RelatedCard: React.FC<{
  _id: string;
  title: string;
  category: string;
  image: string;
}> = function (props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isMale } = useSelector((state: RootState) => state.userActions);

  const onCardRedirect = function () {
    dispatch(setExplorePreviewVisibility(true));
    navigate(`/app/explore/${props._id}`);
  };

  return (
    <div className={styles.card} onClick={onCardRedirect}>
      <div className={styles["image-wrapper"]}>
        <img src={props.image} />
        <div
          className={`${isMale ? styles.male : styles.female} ${
            styles.gradient
          }`}
        />
      </div>
      <div className={styles.details}>
        <span>
          <h6>{props.title}</h6>
          <p>{props.category}</p>
        </span>
        <button>Explore</button>
      </div>
    </div>
  );
};

export default RelatedCard;
