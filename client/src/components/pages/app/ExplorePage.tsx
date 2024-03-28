import React, { useEffect } from "react";
import ExploreCarousel from "../../explore_page/explore_carousel/ExploreCarousel";

import styles from "./ExplorePage.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setExplorePreviewVisibility,
  setHeadersState,
} from "../../../features/styles-manager-actions";
import CatalogFilter from "../../explore_page/catalog_filter/CatalogFilter";
import ExploreCard from "../../explore_page/explore_card/ExploreCard";
import { mainAPIPath } from "../../../App";
import { RootState } from "../../../features/store";
import {
  ExploreCardsI,
  addLoadedCards,
} from "../../../features/explore-actions";
import { getToken } from "../../../util/auth";
import { useLoaderData } from "react-router-dom";
import LoadingPlane from "../../UI/LoadingPlane/LoadingPlane";

function ExplorePage() {
  const dispatch = useDispatch();

  const firstSetCards = useLoaderData();
  const { loadedCards, fetchEnd, fetchError } = useSelector(
    (state: RootState) => state.exploreState
  );
  const loadingState = useSelector(
    (state: RootState) => state.loadingManager.isLoading
  );

  const { isMale } = useSelector((state: RootState) => state.userActions);

  useEffect(() => {
    dispatch(
      setHeadersState({
        mainHeader: "Just for you!",
        subHeader:
          "Explore premade workouts popular amoung the community and add them to your routines!",
        centered: true,
      })
    );

    if (firstSetCards) {
      dispatch(addLoadedCards(firstSetCards as ExploreCardsI[]));
    }

    dispatch(setExplorePreviewVisibility(false));
  }, []);

  return (
    <React.Fragment>
      <header className={styles.carousel}>
        <ExploreCarousel />
      </header>
      <CatalogFilter />
      <main className={styles.grid}>
        {loadedCards.map((card) => (
          <ExploreCard
            key={card._id}
            _id={card._id}
            title={card.title}
            category={card.category}
            duration={card.duration}
            image={card.image}
          />
        ))}
      </main>
      <div
        className={styles["loader-wrapper"]}
        style={loadingState && loadedCards.length == 0 ? { height: "50%" } : {}}
      >
        {loadingState && <LoadingPlane />}
        {fetchEnd && loadedCards.length > 0 && <p>All Records Are Shown!</p>}
        {fetchEnd && loadedCards.length == 0 && (
          <p>No records match this criteria!</p>
        )}
        {fetchError && (
          <button
            style={
              isMale ? { borderColor: "#472ed8", color: "#472ed8" } : undefined
            }
          >
            Load more workouts
          </button>
        )}
      </div>
    </React.Fragment>
  );
}

export default ExplorePage;

export const firstCardsSetLoader = async function () {
  try {
    const response = await fetch(
      `${mainAPIPath}/explore/fetch-data?fetchCount=${1}&mode=just_for_you`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (response.ok) {
      const data: { cards: ExploreCardsI[] } = await response.json();
      return data.cards;
    }

    return null;
  } catch (error) {
    return null;
  }
};
