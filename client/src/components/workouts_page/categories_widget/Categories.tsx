import React from "react";

import Widget from "../Widget";
import Activities from "./Activities";
import WorkoutsButton from "./WorkoutsButtons";

import styles from "./Categories.module.css";

const Categroies: React.FC = () => {
  return (
    <Widget>
      <div className={styles.header}>
        <h6>Categories</h6>
        <a>See all</a>
      </div>
      <Activities />
      <WorkoutsButton />
    </Widget>
  );
};

export default Categroies;
