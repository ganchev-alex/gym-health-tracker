import styles from "./Heading.module.css";

import userSample from "../../../../assets/images/user_sample.png";
import medalSample from "../../../../assets/images/medal_sample.png";
import dumbbellSample from "../../../../assets/images/dumbbell_sample.png";
import { useNavigate } from "react-router-dom";

const Heading = function () {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <h2 className={styles["background-heading"]}>Grow Your Strenght</h2>
      <h1>
        <span>Ignite Your Athletic Passion</span> with our Sport Tracker
      </h1>
      <h4>
        As we developed our <span>sport tracker</span>, our vision surpassed the
        mere creation of another app. Our aim was to
        <span> place you at the heart of it all.</span>
      </h4>
      <button
        className={styles.button}
        onClick={() => {
          navigate("/auth");
        }}
      >
        Join Now
      </button>
      <div className={styles["bond-wrapper"]}>
        <div className={styles.bond}>
          <span>
            <img src={userSample} />
            Over 100 000+ Users
          </span>
          <span>
            <img src={medalSample} />
            96% Satisfied Users
          </span>
          <span>
            <img src={dumbbellSample} />
            Personalized Training Plans
          </span>
        </div>
      </div>
    </header>
  );
};

export default Heading;
