import React from "react";

import Widget from "../../layout/Widget";
import Activities from "./Activities";
import WorkoutsButton from "./WorkoutsButtons";

import styles from "./Categories.module.css";

const Categroies: React.FC = () => {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <h6>Categories</h6>
        <a>See all</a>
      </div>
      <Activities />
      <WorkoutsButton />
    </div>
  );
};

export default Categroies;
