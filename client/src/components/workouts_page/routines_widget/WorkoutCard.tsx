import React from "react";

import CardBottom from "./CardBottom";

import styles from "./WorkoutCard.module.css";

const WorkoutCard: React.FC<{
  name: string;
  description: string;
  duration: string;
  category: string;
}> = (props) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h6>{props.name}</h6>
        <button>
          <div />
          <div />
          <div />
        </button>
      </div>
      <p className={styles.description}>{props.description}</p>
      <CardBottom duration={props.duration} category={props.category} />
    </div>
  );
};

export default WorkoutCard;
