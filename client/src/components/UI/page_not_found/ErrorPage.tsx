import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../features/store";

// import styles from "./FormLayout.module.css";
import styles from "../../layout/FormLayout.module.css";
import inheritedStyles from "../../pages/auth/SignInForm.module.css";

import maleBackground from "../../../assets/images/male_background_signin_form.jpg";
import femaleBackground from "../../../assets/images/female_background_signin_form.jpg";

const ErrorPage: React.FC = function () {
  const navigate = useNavigate();

  const selectedMode = useSelector((state: RootState) => state.userActions.sex);
  const styleChecker = localStorage.getItem("userSex") || selectedMode;

  const mainClasses = `${styles["wrapper"]} ${
    styleChecker === "male" ? styles.male : styles.female
  }`;

  const selectedGradient = `${
    styleChecker === "male"
      ? styles["male-gradient"]
      : styles["female-gradient"]
  }`;

  return (
    <main className={mainClasses}>
      <div className={styles["image-slot"]}>
        <img
          src={maleBackground}
          className={styleChecker == "male" ? "" : styles.hidden}
        />
        <img
          src={femaleBackground}
          className={styleChecker == "female" ? "" : styles.hidden}
        />
        <div className={selectedGradient} />
      </div>
      <div className={styles["form-holder"]}>
        <div className={styles["responsive-background"]}>
          <img
            src={maleBackground}
            className={styleChecker == "male" ? "" : styles.hidden}
          />
          <img
            src={femaleBackground}
            className={styleChecker == "female" ? "" : styles.hidden}
          />
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <header className={inheritedStyles["header-wrapper"]}>
            <h3 style={{ marginTop: "3em" }}>404.</h3>
            <p>It seems like you tried to open a page that does not exist.</p>
          </header>
          <p className={inheritedStyles.divider}>page not found</p>
          <button
            type="submit"
            className={inheritedStyles["submit-button"]}
            onClick={() => navigate("/auth/login")}
          >
            Take me back
          </button>
        </form>
      </div>
    </main>
  );
};

export default ErrorPage;
