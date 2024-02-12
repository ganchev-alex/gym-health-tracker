import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import {
  addFilter,
  removeFilter,
  selectAll,
} from "../../../features/workout-page-actions";

import styles from "./CategoriesFilter.module.css";

const CategoriesFilter: React.FC<{ categories: string[] }> = (props) => {
  const filterLabels = [...new Set(props.categories)];

  const dispatch = useDispatch();
  const selectedFilters = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.selectedFilters;
  });
  let isAll = useSelector((state: RootState) => {
    return state.widgetsManager.routinesWidget.isAll;
  });

  if (selectedFilters.length !== 0) {
    isAll = false;
  } else {
    isAll = true;
  }

  const onSelectAll = function () {
    dispatch(selectAll());
  };

  const onSelectFilter = function (label: string) {
    if (selectedFilters.includes(label)) {
      dispatch(removeFilter({ label }));
    } else {
      dispatch(addFilter({ label }));
    }
  };

  return (
    <div className={styles.filter}>
      <button
        className={isAll ? styles.active : styles.inactive}
        onClick={() => onSelectAll()}
      >
        All
      </button>
      {filterLabels.map((label, index) => {
        return (
          <button
            key={index}
            className={
              selectedFilters.includes(label) ? styles.active : styles.inactive
            }
            onClick={() => onSelectFilter(label)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoriesFilter;
