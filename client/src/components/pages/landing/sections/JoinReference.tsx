import styles from "./JoinReferences.module.css";

import imagePath from "../../../../assets/images/section3_image.jpg";

const JoinReference = function () {
  return (
    <section className={styles.section}>
      <img src={imagePath} />
      <main className={styles.content}>
        <h3>It's About Who You Can Become</h3>
        <p>
          Embark on a transformative journey towards becoming the best version
          of yourself with our revolutionary fitness application. Beyond just
          tracking workouts and monitoring progress, our platform is a gateway
          to unlocking your full potential. It's about embracing the
          possibilities of who you can become. Whether you're striving for
          physical strength, mental clarity, or overall well-being, our app is
          your steadfast companion, guiding you every step of the way. Join our
          community of motivated individuals and embark on a path of
          self-discovery and empowerment.
        </p>
        <p>
          Together, let's rewrite the narrative of what's possible and unlock
          the extraordinary within you. So what are you waiting for?
        </p>
        <button className={styles.button}>Join Now</button>
      </main>
    </section>
  );
};

export default JoinReference;
