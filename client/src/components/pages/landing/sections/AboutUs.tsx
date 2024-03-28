import style from "./AboutUs.module.css";

import imagePath from "../../../../assets/images/section1_image.png";

const AboutUs = function () {
  return (
    <section className={style.section} id="about-us">
      <div className={style.left}>
        <figure className={style.circle} />
        <img src={imagePath} />
      </div>
      <div className={style.rigth}>
        <h3>Ready to make a change?</h3>
        <h6 className={style["background-header"]}>About Us</h6>
        <p>
          Welcome to our gym tracker application, where transformation begins
          with a single step. Designed for enthusiasts, beginners, and everyone
          in between, our app revolutionizes the way you approach fitness.
        </p>
        <p>
          Seamlessly integrating with your daily routine, it empowers you to set
          goals, track progress, and celebrate achievements. Whether you're
          aiming to shed pounds, gain strength, or simply adopt a healthier
          lifestyle, our intuitive platform provides the tools and motivation
          you need to succeed. Join our community today and embark on a journey
          of self-improvement unlike any other.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
