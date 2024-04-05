import styles from "./Footer.module.css";

const Footer = function () {
  return (
    <footer className={styles.footer}>
      <p>
        Contact us:{" "}
        <a href="mailto:health.tracker.ag@gmail.com">
          health.tracker.ag@gmail.com
        </a>
      </p>
      <p>
        You can use the "contact us" link to reach out to the developer of the
        application.
      </p>
      <h5>© 2024 Health Tracker. Junior Development Projct - A. Ganchev.</h5>
    </footer>
  );
};

export default Footer;
