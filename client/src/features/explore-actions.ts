import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ExploreI {
  filterOptions: {
    exploreOption: string;
    category: string;
    duration: string;
    contentType: string;
    keywords: string;
  };
  loadedCards: ExploreCardsI[];
  fetchEnd: boolean;
  fetchError: boolean;
  resetedFetching: boolean;
}

export interface ExploreCardsI {
  _id: string;
  title: string;
  category: string;
  duration: number;
  image: string;
}

const initialState: ExploreI = {
  filterOptions: {
    exploreOption: "Just for you",
    category: "",
    duration: "Set Duration",
    contentType: "Set Content Type",
    keywords: "",
  },
  loadedCards: [],
  fetchEnd: false,
  fetchError: false,
  resetedFetching: false,
};

const exploreManager = createSlice({
  name: "exploreManger",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{
        exploreOption?: string;
        category?: string;
        duration?: string;
        contentType?: string;
        keywords?: string;
      }>
    ) => {
      const { exploreOption, category, duration, contentType, keywords } =
        action.payload;
      if (exploreOption !== undefined) {
        state.filterOptions.exploreOption = exploreOption;
      }
      if (category !== undefined) {
        state.filterOptions.category = category;
      }
      if (duration !== undefined) {
        state.filterOptions.duration = duration;
      }
      if (contentType !== undefined) {
        state.filterOptions.contentType = contentType;
      }
      if (keywords !== undefined) {
        state.filterOptions.keywords = keywords;
      }
    },
    addLoadedCards: (state, action: PayloadAction<ExploreCardsI[]>) => {
      if (action.payload.length > 0) {
        action.payload.forEach((card) => {
          if (
            !state.loadedCards.some((loadedCard) => loadedCard._id === card._id)
          ) {
            state.loadedCards.push(card);
          }
        });
        state.fetchEnd = false;
      } else {
        state.fetchEnd = true;
      }
    },
    resetLoadedCards: (state) => {
      state.loadedCards = [];
      state.fetchEnd = false;
      state.resetedFetching = true;
    },
    setFetchError: (state, action: PayloadAction<boolean>) => {
      state.fetchError = action.payload;
    },
    setResetState: (state, action: PayloadAction<boolean>) => {
      state.resetedFetching = action.payload;
    },
    setExploreInitialState: () => {
      return initialState;
    },
  },
});

export const {
  setFilter,
  addLoadedCards,
  resetLoadedCards,
  setFetchError,
  setResetState,
  setExploreInitialState,
} = exploreManager.actions;
export default exploreManager.reducer;
