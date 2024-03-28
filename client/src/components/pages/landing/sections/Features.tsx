import styles from "./Features.module.css";

import tunePath from "../../../../assets/images/tune_sample.png";
import brushPath from "../../../../assets/images/brush_sample.png";
import dataPath from "../../../../assets/images/data_sample.png";

const Features = function () {
  return (
    <section className={styles["section-wrapper"]} id="features">
      <h3>What make us special?</h3>
      <h6 className={styles["background-header"]}>Features</h6>
      <article>
        <header>
          <img src={tunePath} />
          <h4>Personalized Feel</h4>
        </header>
        <p>
          Experience fitness tailored to you with our application's personalized
          approach. Every aspect of the app revolves around your unique needs
          and preferences, ensuring that your journey to wellness is truly
          yours. From customized workout plans to targeted health insights, the
          center of our app is you, empowering you to take control of your
          fitness destiny like never before.
        </p>
      </article>
      <article>
        <header>
          <img src={brushPath} />
          <h4>Feel Connected</h4>
        </header>
        <p style={{ textAlign: "justify" }}>
          Elevate your fitness experience with a theme that resonates with your
          identity. Our app adapts its design based on your gender, creating a
          personalized aesthetic that speaks to who you are. Whether it's subtle
          hues or bold accents, the theme curated specifically for you adds an
          extra layer of personalization, making every interaction with the app
          feel like a reflection of your individuality.
        </p>
      </article>
      <article>
        <header>
          <img src={dataPath} />
          <h4>History Vault</h4>
        </header>
        <p>
          Rest assured knowing that your fitness journey is securely stored and
          readily accessible. With our history preview features, your data is
          safeguarded within the app, allowing you to retrieve and manage it at
          your convenience. Whether you're tracking progress over time or
          analyzing past workouts for insights, you have uninterrupted access to
          your valuable data whenever and wherever you need it.
        </p>
      </article>
    </section>
  );
};

export default Features;
