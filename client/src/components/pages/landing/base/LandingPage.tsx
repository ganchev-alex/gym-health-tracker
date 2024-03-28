import style from "./LandingPage.module.css";

import Navigation from "../navigation/Navigation";
import Heading from "../sections/Heading";

import headerImage from "../../../../assets/images/header_image.png";
import AboutUs from "../sections/AboutUs";
import Services from "../sections/Services";
import Features from "../sections/Features";
import JoinReference from "../sections/JoinReference";

const LandingPage = function () {
  return (
    <main className={style.main}>
      <div className={style.limit}>
        <Navigation />
        <div>
          <figure className={style.circle} />
          <img src={headerImage} className={style["header-image"]} />
        </div>
        <Heading />
        <AboutUs />
        <Services />
        <Features />
        <JoinReference />
      </div>
    </main>
  );
};

export default LandingPage;
