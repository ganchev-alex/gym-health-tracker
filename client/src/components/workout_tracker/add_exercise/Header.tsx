import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setAddExerciseState,
  setFilterValue,
  setFitlerState,
  setSearchExercise,
} from "../../../features/workout";

import styles from "./Headers.module.css";

import Search from "../../../assets/svg_icon_components/Search";
import { RootState } from "../../../features/store";

const Header = function () {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const { equipment: keyEquipment, muscle: keyMuscle } = useSelector(
    (state: RootState) => {
      return state.workoutState.filterValue;
    }
  );

  useEffect(() => {
    const indentifier = setTimeout(() => {
      dispatch(setSearchExercise(searchValue));
    }, 500);

    return () => {
      clearTimeout(indentifier);
    };
  }, [searchValue]);

  const onSearchChange = function (event: ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  };

  const triggerEquipmentFilter = function () {
    dispatch(setFitlerState({ visibility: true, type: "Equipment" }));
  };

  const triggerMuscleFilter = function () {
    dispatch(setFitlerState({ visibility: true, type: "Muscle Group" }));
  };

  const resetFilter = function () {
    dispatch(setFilterValue({ equipment: undefined, muscle: undefined }));
  };

  const onClose = function () {
    dispatch(setAddExerciseState({ visibility: false }));
  };

  const availableFilter = keyEquipment || keyMuscle;

  return (
    <header className={styles.header}>
      <div className={styles["header-bond"]}>
        <h4>Add Exercise</h4>
        <button onClick={onClose}>x</button>
      </div>
      <form className={styles["search-form"]}>
        <div className={styles["search-bar"]}>
          <button>
            <Search />
          </button>
          <input
            type="text"
            placeholder="Search exercise..."
            onChange={onSearchChange}
            value={searchValue || ""}
          />
        </div>
        <div className={styles["filter-buttons"]}>
          <button
            className={keyEquipment ? styles.selected : ""}
            style={availableFilter ? { width: "46%" } : { width: "49%" }}
            onClick={triggerEquipmentFilter}
            type="button"
          >
            {keyEquipment || "All Equipment"}
          </button>
          <button
            className={keyMuscle ? styles.selected : ""}
            style={availableFilter ? { width: "46%" } : { width: "49%" }}
            onClick={triggerMuscleFilter}
            type="button"
          >
            {keyMuscle || "All Muscles"}
          </button>
          {availableFilter && (
            <button
              className={styles.clear}
              type="button"
              onClick={resetFilter}
            >
              x
            </button>
          )}
        </div>
      </form>
    </header>
  );
};

export default Header;
