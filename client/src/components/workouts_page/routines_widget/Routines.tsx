import { useState } from "react";

import Widget from "../Widget";
import CardsHolder from "./CardsHolder";
import CategoriesFilter from "./CategoriesFilter";

import styles from "./Routines.module.css";

const DUMMY_DATA = [
  {
    name: "Arms (Triceps, Biceps & Shoulders)",
    description: "This workouts hits all muscels from your arms.",
    duration: "1:30 hours",
    category: "Gym & Weightlifting",
  },
  {
    name: "Legs & Abs",
    description:
      "All leg muscel groups workout followed by a super intense abs finisher.🔥",
    duration: "1:00 hours",
    category: "Gym & Weightlifting",
  },
  {
    name: "Intense Cardio",
    description: "A whole body dynamic cardio workout. Burn those callories.",
    duration: "45 minutes",
    category: "Cardio",
  },
  {
    name: "Meditation Session",
    description: "Slow down your breath and allow your mind to take a break.",
    duration: "15 minutes",
    category: "Meditation",
  },
  {
    name: "Yoga Session",
    description: "A whole body yoga session, focusing on your upper part.",
    duration: "50 minutes",
    category: "Yoga",
  },
];

const Routines: React.FC = () => {
  const categories = DUMMY_DATA.map((workout) => {
    return workout.category;
  });

  return (
    <Widget>
      <h6 className={styles.header}>My Routines</h6>
      <p className={styles.comment}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit iusto
        nulla, distinctio eligendi eveniet delectus.
      </p>
      <CategoriesFilter categories={categories} />
      <CardsHolder workouts={DUMMY_DATA} />
    </Widget>
  );
};

export default Routines;
