import React, { useEffect, useState } from "react";
import styles from "./CatalogFilter.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import { resetLoadedCards, setFilter } from "../../../features/explore-actions";

const categories = [
  "Gym & Weightlifting",
  "Cardio",
  "Yoga",
  "Stretching",
  "Meditation",
  "CrossFit",
];

const exploreOptionsLabels = ["Just for you", "Explore All", "Saved"];

const durationOptionsLabels = [
  "Quick Session",
  "30 minutes",
  "Under an hour",
  "1 hour",
  "1:30 hours",
  "Long Sessions",
];

const contentTypeLabels = ["Routine", "Video"];

const CatalogFilter = function () {
  const dispatch = useDispatch();
  const { filterOptions } = useSelector((state: RootState) => {
    return state.exploreState;
  });

  const { exploreOption, category, duration, contentType, keywords } =
    filterOptions;

  const [exploreVisibility, setExploreVisibility] = useState(false);
  const [filterVisibility, setFilterVisibility] = useState(false);
  const [durationVisibility, setDurationVisibility] = useState(false);
  const [contentVisibility, setContentVisibility] = useState(false);

  const [keywordsValue, setKeywordsValue] = useState("");

  useEffect(() => {
    dispatch(resetLoadedCards());
  }, [filterOptions]);

  useEffect(() => {
    const identifier = setTimeout(() => {
      dispatch(setFilter({ keywords: keywordsValue }));
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [keywordsValue]);

  const onExploreOptionSelect = function (label: string) {
    dispatch(setFilter({ exploreOption: label }));
    setExploreVisibility(false);
  };

  const onCategorySelect = function (label: string) {
    if (label === category) {
      dispatch(setFilter({ category: "" }));
    } else {
      dispatch(setFilter({ category: label }));
    }
  };

  const onOpenFilterOptions = function () {
    setFilterVisibility((previosState) => {
      if (previosState) {
        dispatch(
          setFilter({
            duration: "Set Duration",
            contentType: "Set Content Type",
          })
        );
      }

      return !previosState;
    });
    setDurationVisibility(false);
    setContentVisibility(false);
  };

  const onDurationSelect = function (label: string) {
    if (label === duration) {
      dispatch(setFilter({ duration: "Set Duration" }));
    } else {
      dispatch(setFilter({ duration: label }));
    }
    setDurationVisibility(false);
  };

  const onContentTypeSelect = function (label: string) {
    if (label === contentType) {
      dispatch(setFilter({ contentType: "Set Content Type" }));
    } else {
      dispatch(setFilter({ contentType: label }));
    }
    setContentVisibility(false);
  };

  return (
    <React.Fragment>
      <div className={styles.controlls}>
        <button
          className={styles.explore}
          onClick={() => {
            setExploreVisibility((previousState) => !previousState);
          }}
        >
          {exploreOption}
        </button>
        {exploreVisibility && (
          <div className={styles.options}>
            {exploreOptionsLabels.map((label) => {
              return (
                <button
                  key={label}
                  className={`${
                    label === exploreOption ? styles["options-active"] : ""
                  }`}
                  onClick={() => {
                    onExploreOptionSelect(label);
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
        <div className={styles.categories}>
          {categories.map((categoryLable) => {
            return (
              <button
                key={categoryLable}
                className={`${
                  categoryLable === category ? styles["category-active"] : ""
                }`}
                onClick={() => {
                  onCategorySelect(categoryLable);
                }}
              >
                {categoryLable}
              </button>
            );
          })}
        </div>
        <button
          className={styles["filter-toggle"]}
          onClick={onOpenFilterOptions}
        >
          Filter
        </button>
      </div>
      {filterVisibility && (
        <div className={styles.filter}>
          <span>
            <label>Keywords</label>
            <input
              type="text"
              value={keywordsValue}
              onChange={(e) => setKeywordsValue(e.target.value)}
            />
          </span>
          <span>
            <label>Duration</label>
            <button
              className={styles["filter-button"]}
              onClick={() =>
                setDurationVisibility((previousState) => !previousState)
              }
            >
              {duration}
            </button>
            {durationVisibility && (
              <div
                className={styles.options}
                style={{ width: "100%", top: "125%" }}
              >
                {durationOptionsLabels.map((durationLable) => {
                  return (
                    <button
                      key={durationLable}
                      className={`${
                        duration === durationLable
                          ? styles["options-active"]
                          : ""
                      }`}
                      onClick={() => {
                        onDurationSelect(durationLable);
                      }}
                    >
                      {durationLable}
                    </button>
                  );
                })}
              </div>
            )}
          </span>
          <span>
            <label>Content Type</label>
            <button
              className={styles["filter-button"]}
              onClick={() => {
                setContentVisibility((previousState) => !previousState);
              }}
            >
              {contentType}
            </button>
            {contentVisibility && (
              <div
                className={styles.options}
                style={{ width: "100%", top: "125%" }}
              >
                {contentTypeLabels.map((contentTypeLable) => {
                  return (
                    <button
                      key={contentTypeLable}
                      className={`${
                        contentTypeLable === contentType
                          ? styles["options-active"]
                          : ""
                      }`}
                      onClick={() => {
                        onContentTypeSelect(contentTypeLable);
                      }}
                    >
                      {contentTypeLable}
                    </button>
                  );
                })}
              </div>
            )}
          </span>
        </div>
      )}
    </React.Fragment>
  );
};

export default CatalogFilter;
