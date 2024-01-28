import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import { setFitlerState } from "../../../features/workout";

import styles from "./Filter.module.css";
import FilterOption from "./FilterOption";

import barbell from "../../../assets/images/barbell.png";
import dumbbell from "../../../assets/images/dumbell.png";
import machine from "../../../assets/images/machine.png";
import bodyWeight from "../../../assets/images/bodyweigth.png";
import band from "../../../assets/images/band.png";

import abdominals from "../../../assets/images/abdominals.jpg";
import abductors from "../../../assets/images/abductors.jpg";
import adductors from "../../../assets/images/adductors.jpg";
import biceps from "../../../assets/images/biceps.png";
import calves from "../../../assets/images/calves.png";
import chest from "../../../assets/images/chest.png";
import forearms from "../../../assets/images/forearms.png";
import glutes from "../../../assets/images/glutes.png";
import hamstrings from "../../../assets/images/hamstrings.jpg";
import lats from "../../../assets/images/lats.jpg";
import quadriceps from "../../../assets/images/quadriceps.png";
import shoulders from "../../../assets/images/shoulders.png";
import upperBack from "../../../assets/images/traps.jpg";
import triceps from "../../../assets/images/triceps.png";

const equimpent = [
  { label: "Barbell", img: barbell },
  { label: "Dumbbells", img: dumbbell },
  { label: "Machine", img: machine },
  { label: "Suspension Band", img: band },
  { label: "Bodyweight", img: bodyWeight },
];

const muscleGroups = [
  { label: "Abdominals", img: abdominals },
  { label: "Abductors", img: abductors },
  { label: "Adductors", img: adductors },
  { label: "Biceps", img: biceps },
  { label: "Calves", img: calves },
  { label: "Chest", img: chest },
  { label: "Forearms", img: forearms },
  { label: "Glutes", img: glutes },
  { label: "Hamstrings", img: hamstrings },
  { label: "Lats", img: lats },
  { label: "Quadriceps", img: quadriceps },
  { label: "Shoulders", img: shoulders },
  { label: "Upper Back", img: upperBack },
  { label: "Triceps", img: triceps },
];

const Filter = function () {
  const [selectedOptions, setSelectedOptions] = useState<
    { label: string; img: string }[]
  >([]);

  const { type } = useSelector(
    (state: RootState) => state.workoutState.filterState
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (type === "Equipment") {
      setSelectedOptions(equimpent);
    } else {
      setSelectedOptions(muscleGroups);
    }
  }, []);

  const onClose = function () {
    dispatch(setFitlerState(false));
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.ribbon}>
        <h6>{type}</h6>
        <button onClick={onClose}>Close</button>
      </div>
      <div className={styles.filter}>
        {selectedOptions.length > 0 &&
          selectedOptions.map((option, index) => {
            return <FilterOption optionData={option} key={index} />;
          })}
      </div>
    </div>
  );
};

export default Filter;
