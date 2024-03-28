import styles from "./Services.module.css";

import imagePath from "../../../../assets/images/section2_image.png";

const Services = function () {
  return (
    <main className={styles.main} id="services">
      <h2>Services We Provide</h2>
      <h4 className={styles["background-header"]}>Our Services</h4>
      <article className={styles.article}>
        <section className={styles.left}>
          <div>
            <h3>Workout Dashboard</h3>
            <p>
              Your central hub for fitness management and progress tracking.
              Effortlessly organize and monitor every aspect of your workouts in
              one convenient location. From accessing premade routines to
              logging reps and sets, the Workout Dashboard streamlines your
              fitness journey, ensuring nothing stands between you and your
              goals.
            </p>
          </div>
          <div>
            <h3>Statistics</h3>
            <p>
              Gain invaluable insights into your fitness journey with
              comprehensive statistics. Delve into detailed analytics showcasing
              your progress, performance trends, and muscle activation patterns.
              Armed with this knowledge, you can fine-tune your training
              strategies, identify areas for improvement, and celebrate
              milestones on your path to success.
            </p>
          </div>
        </section>
        <section className={styles.middle}>
          <img src={imagePath} />
        </section>
        <section className={styles.rigth}>
          <div>
            <h3>Explore</h3>
            <p>
              Dive into a world of diverse workout possibilities with Explore.
              Access a vast collection of expertly crafted workout routines
              tailored to your preferences and objectives. Whether you're
              targeting specific muscle groups, seeking cardio challenges, or
              exploring new fitness disciplines, Explore provides endless
              inspiration to keep your workouts engaging and effective.
            </p>
          </div>
          <div>
            <h3>Health Essentials</h3>
            <p>
              Take charge of your well-being with our Health Essentials feature.
              Seamlessly monitor vital health metrics such as sleep patterns,
              hydration levels, and dietary intake. Stay informed and empowered
              to make healthier choices, fostering a balanced lifestyle that
              supports your fitness endeavors.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Services;
