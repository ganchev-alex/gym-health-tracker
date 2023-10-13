import styles from "./Widget.module.css";

const Widget: React.FC<{ children: JSX.Element[] }> = (props) => {
  return <div className={styles.widget}>{props.children}</div>;
};

export default Widget;
