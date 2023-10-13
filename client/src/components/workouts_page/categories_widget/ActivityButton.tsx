import React from "react";

import styles from "./ActivityButton.module.css";

const ActivityButton: React.FC<{ icon: React.ReactNode }> = (props) => {
  return <button className={styles.button}>{props.icon}</button>;
};

export default ActivityButton;
