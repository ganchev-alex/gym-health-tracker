import styles from "./BodyDisplay.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../features/store";

import frontBase from "../../../assets/body/male/front_full.png";
import backBase from "../../../assets/body/male/back_full.png";

// Male Back View
import calvesBM from "../../../assets/body/male/back/back_male_calves.png";
import glutesBM from "../../../assets/body/male/back/back_male_glutes.png";
import hamstringsBM from "../../../assets/body/male/back/back_male_hamstrings.png";
import hipsBM from "../../../assets/body/male/back/back_male_hips.png";
import latsBM from "../../../assets/body/male/back/back_male_lats.png";
import lowerBackBM from "../../../assets/body/male/back/back_male_lowerback.png";
import rearDeltsBM from "../../../assets/body/male/back/back_male_reardelts.png";
import tricepsBM from "../../../assets/body/male/back/back_male_triceps.png";
import upperBackBM from "../../../assets/body/male/back/back_male_upperback.png";

// Male Front View
import abdominalsFM from "../../../assets/body/male/front/front_male_abdominals.png";
import bicepsFM from "../../../assets/body/male/front/front_male_biceps.png";
import calvesFM from "../../../assets/body/male/front/front_male_calves.png";
import chestFM from "../../../assets/body/male/front/front_male_chest.png";
import forearmsFM from "../../../assets/body/male/front/front_male_forearms.png";
import hipsFM from "../../../assets/body/male/front/front_male_hips.png";
import obliquesFM from "../../../assets/body/male/front/front_male_obliques.png";
import quadricepsFM from "../../../assets/body/male/front/front_male_quadriceps.png";
import shouldersFM from "../../../assets/body/male/front/front_male_shoulders.png";

// Female Back View
import calvesBF from "../../../assets/body/female/back/back_female_calves.png";
import glutesBF from "../../../assets/body/female/back/back_female_glutes.png";
import hamstringsBF from "../../../assets/body/female/back/back_female_hamstrings.png";
import hipsBF from "../../../assets/body/female/back/back_female_hips.png";
import latsBF from "../../../assets/body/female/back/back_female_lats.png";
import lowerBackBF from "../../../assets/body/female/back/back_female_lowerback.png";
import rearDeltsBF from "../../../assets/body/female/back/back_female_reardelts.png";
import tricepsBF from "../../../assets/body/female/back/back_female_triceps.png";
import upperBackBF from "../../../assets/body/female/back/back_female_upperback.png";

// FeMale Front View
import abdominalsFF from "../../../assets/body/female/front/front_female_abdominals.png";
import bicepsFF from "../../../assets/body/female/front/front_female_biceps.png";
import calvesFF from "../../../assets/body/female/front/front_female_calves.png";
import chestFF from "../../../assets/body/female/front/front_female_chest.png";
import forearmsFF from "../../../assets/body/female/front/front_female_forearms.png";
import hipsFF from "../../../assets/body/female/front/front_female_hips.png";
import obliquesFF from "../../../assets/body/female/front/front_female_obliques.png";
import quadricepsFF from "../../../assets/body/female/front/front_female_quadriceps.png";
import shouldersFF from "../../../assets/body/female/front/front_female_shoulders.png";

const BodyDisplay = function () {
  const { muscleGroups } = useSelector(
    (state: RootState) => state.statsData.muscleGraph
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <div className={styles.plane}>
      <div className={styles.base}>
        <img src={frontBase} className={styles["base-img"]} />
        {muscleGroups.filter(
          (muscle) => muscle.includes("abdo") || muscle.includes("core")
        ).length > 0 && (
          <img
            className={styles.muscle}
            src={isMale ? abdominalsFM : abdominalsFF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("biceps") && (
          <img
            className={styles.muscle}
            src={isMale ? bicepsFM : bicepsFF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("calves") && (
          <img
            className={styles.muscle}
            src={isMale ? calvesFM : calvesFF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("chest") && (
          <img
            className={styles.muscle}
            src={isMale ? chestFM : chestFF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("forearms") && (
          <img
            className={styles.muscle}
            src={isMale ? forearmsFM : forearmsFF}
            loading="lazy"
          />
        )}
        {muscleGroups.filter(
          (muslce) => muslce.includes("abduct") || muslce.includes("adduct")
        ).length > 0 && (
          <img
            className={styles.muscle}
            src={isMale ? hipsFM : hipsFF}
            loading="lazy"
          />
        )}
        {muscleGroups.filter(
          (muscle) => muscle.includes("core") || muscle.includes("obliques")
        ).length > 0 && (
          <img
            className={styles.muscle}
            src={isMale ? obliquesFM : obliquesFF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("quadriceps") && (
          <img
            className={styles.muscle}
            src={isMale ? quadricepsFM : quadricepsFF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("shoulders") && (
          <img
            className={styles.muscle}
            src={isMale ? shouldersFM : shouldersFF}
            loading="lazy"
          />
        )}
      </div>
      <div className={styles.base}>
        <img src={backBase} className={styles["base-img"]} loading="lazy" />
        {muscleGroups.includes("calves") && (
          <img
            className={styles.muscle}
            src={isMale ? calvesBM : calvesBF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("glutes") && (
          <img
            className={styles.muscle}
            src={isMale ? glutesBM : glutesBF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("hamstrings") && (
          <img
            className={styles.muscle}
            src={isMale ? hamstringsBM : hamstringsBF}
            loading="lazy"
          />
        )}
        {muscleGroups.filter(
          (muslce) => muslce.includes("abduct") || muslce.includes("adduct")
        ).length > 0 && (
          <img
            className={styles.muscle}
            src={isMale ? hipsBM : hipsBF}
            loading="lazy"
          />
        )}
        {muscleGroups.filter((muscle) => muscle.includes("lat")).length > 0 && (
          <img
            className={styles.muscle}
            src={isMale ? latsBM : latsBF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("lower back") && (
          <img
            className={styles.muscle}
            src={isMale ? lowerBackBM : lowerBackBF}
            loading="lazy"
          />
        )}
        {muscleGroups.filter(
          (muscle) => muscle.includes("rhomboids") || muscle.includes("rear")
        ).length > 0 && (
          <img
            className={styles.muscle}
            src={isMale ? rearDeltsBM : rearDeltsBF}
            loading="lazy"
          />
        )}
        {muscleGroups.includes("triceps") && (
          <img
            className={styles.muscle}
            src={isMale ? tricepsBM : tricepsBF}
            loading="lazy"
          />
        )}
        {muscleGroups.filter(
          (muscle) =>
            muscle.includes("upper back") ||
            muscle.includes("trap") ||
            muscle.includes("rhomboids")
        ).length > 0 && (
          <img
            className={styles.muscle}
            src={isMale ? upperBackBM : upperBackBF}
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};

export default BodyDisplay;
