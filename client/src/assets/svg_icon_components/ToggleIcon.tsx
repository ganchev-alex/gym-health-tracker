import styles from "./ConfigurativeProperties.module.css";

function ToggleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="12"
      viewBox="0 0 15 12"
      fill="none"
    >
      <path
        d="M9.4696 1L14.1733 5.70372L9.4696 10.4075"
        className={styles["configurative-properties"]}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.81946 5.70378H14.0417"
        className={styles["configurative-properties"]}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 5.70378H3.68896"
        className={styles["configurative-properties"]}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ToggleIcon;
