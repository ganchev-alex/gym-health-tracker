import { useNavigate } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = function () {
  const navigate = useNavigate();

  const handleSmoothScroll = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className={styles["nav-bar"]}>
      <div className={styles.links}>
        <a
          className={styles.active}
          onClick={() => handleSmoothScroll("home-section")}
        >
          Home
        </a>
        <a onClick={() => handleSmoothScroll("about-us")}>About Us</a>
        <a onClick={() => handleSmoothScroll("services")}>Services</a>
        <a onClick={() => handleSmoothScroll("features")}>Features</a>
      </div>
      <button
        className={styles.button}
        onClick={() => {
          navigate("/auth/login");
        }}
      >
        Log In
      </button>
    </nav>
  );
};

export default Navigation;
