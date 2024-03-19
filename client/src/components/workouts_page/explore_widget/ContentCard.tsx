import { useSelector } from "react-redux";
import BottomCard from "./BottomCard";

import styles from "./ContentCard.module.css";
import { RootState } from "../../../features/store";

const ContentCard: React.FC<{
  _id: string;
  imageSrc: string;
  title: string;
  description: string;
  duration: number;
  category: string;
}> = function (props) {
  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <div className={styles["content-card"]}>
      <div className={styles["image-slot"]}>
        <div
          className={`${isMale ? styles.male : styles.female} ${
            styles["gradient"]
          }`}
        ></div>
        <img src={props.imageSrc} />
      </div>
      <div className={styles["content-wrapper"]}>
        <h4>{props.title}</h4>
        <p>{props.description}</p>
      </div>
      <BottomCard
        _id={props._id}
        category={props.category}
        duration={props.duration}
      />
    </div>
  );
};

export default ContentCard;
