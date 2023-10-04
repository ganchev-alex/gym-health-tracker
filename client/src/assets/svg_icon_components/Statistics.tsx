import styles from "./ConfigurativeProperties.module.css";

function StatisticsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <path
        d="M29.1536 17.1901C33.6384 17.1901 35.5014 15.4652 33.8454 9.80742C32.7242 5.9953 29.4468 2.71791 25.6347 1.5967C19.9769 -0.0592498 18.252 1.80369 18.252 6.28854V11.2564C18.252 15.4652 19.9769 17.1901 23.4268 17.1901H29.1536Z"
        className={styles["configurative-properties"]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.0513 21.8476C30.4471 29.8341 22.7884 35.6299 14.0775 34.2155C7.53994 33.1633 2.27886 27.9022 1.2094 21.3647C-0.187804 12.6882 5.5735 5.02947 13.5255 3.40802"
        className={styles["configurative-properties"]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default StatisticsIcon;
