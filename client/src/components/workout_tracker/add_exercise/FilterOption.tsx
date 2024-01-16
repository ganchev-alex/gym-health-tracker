import { useDispatch, useSelector } from "react-redux";
import styles from "./FilterOption.module.css";
import { RootState } from "../../../features/store";
import { setFilterValue, setFitlerState } from "../../../features/workout";

const FilterOption: React.FC<{ optionData: { label: string; img: string } }> =
  function (props) {
    const dispatch = useDispatch();
    const filterMode = useSelector((state: RootState) => {
      return state.workoutState.filterState.type;
    });

    const { equipment: keyEquipment, muscle: keyMuscle } = useSelector(
      (state: RootState) => {
        return state.workoutState.filterValue;
      }
    );

    const selectingFilter = function (filter: string) {
      if (filterMode === "Equipment")
        if (keyEquipment === filter) {
          dispatch(setFilterValue({ equipment: undefined }));
        } else {
          dispatch(setFilterValue({ equipment: filter }));
        }
      else if (filterMode === "Muscle Group")
        if (keyMuscle === filter) {
          dispatch(setFilterValue({ muscle: undefined }));
        } else {
          dispatch(setFilterValue({ muscle: filter }));
        }

      dispatch(setFitlerState(false));
    };

    return (
      <div
        className={`${styles.option} ${
          keyEquipment === props.optionData.label ||
          keyMuscle === props.optionData.label
            ? styles.active
            : ""
        }`}
        onClick={() => selectingFilter(props.optionData.label)}
      >
        <img
          src={props.optionData.img}
          className={`${
            filterMode === "Muscle Group" ? styles["muscle-image"] : ""
          } ${keyEquipment === props.optionData.label ? styles.invert : ""}`}
        />
        <h6>{props.optionData.label}</h6>
      </div>
    );
  };

export default FilterOption;
