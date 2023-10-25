import BottomCard from "./BottomCard";

import styles from "./ContentCard.module.css";

const ContentCard: React.FC<{
  imageSrc: string;
  title: string;
  description: string;
  category: string;
}> = function (props) {
  return (
    <div className={styles["content-card"]}>
      <div className={styles["image-slot"]}>
        <div className={styles["gradient"]}></div>
        <img src={props.imageSrc} />
      </div>
      <div className={styles["content-wrapper"]}>
        <h4>{props.title}</h4>
        <p>{props.description}</p>
      </div>
      <BottomCard category={props.category} />
    </div>
  );
};

export default ContentCard;
