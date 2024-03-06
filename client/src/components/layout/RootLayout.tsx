import React, { useEffect, useRef, useState } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import NavigationBar from "../UI/navigation_bar/NavigationBar";

import styles from "./RootLayout.module.css";
import { getToken } from "../../util/auth";
import { mainAPIPath } from "../../App";
import {
  FetchedExercise,
  setLoadedUserData,
} from "../../features/user-actions";
import { RootState } from "../../features/store";
import WorkoutTracker from "../workout_tracker/workout_display/WorkoutTracker";
import MinimizeIcon from "../../assets/svg_icon_components/MinimizeIcon";
import {
  decreaseRestTimer,
  incrementWorkoutDuration,
  setRestTimerState,
  setWorkoutState,
} from "../../features/workout";
import NotificationBar from "../UI/Notification/Notification";
import ErrorModal from "../UI/ErrorModal/ErrorModal";
import HistoryPreviewModal from "../workouts_page/history_preview/HistoryPreview";
import {
  Essentials,
  setLoadedEssentialsData,
} from "../../features/health-essentials-actions";
import {
  ExploreCardsI,
  addLoadedCards,
  setFetchError,
  setResetState,
} from "../../features/explore-actions";
import { setLoadingState } from "../../features/loading-actions";
import { setExplorePreviewVisibility } from "../../features/styles-manager-actions";
import LoadingPlane from "../UI/LoadingPlane/LoadingPlane";

function RootLayout() {
  const navigate = useNavigate();
  const pageLoading = useNavigation();
  const dispatch = useDispatch();
  const fetchedData = useLoaderData();

  const {
    today: todayEssData,
    yesterday: yesterdayEssData,
    updated,
  } = useSelector((state: RootState) => state.healthEssentials);

  const { workoutActivity, workoutVisibility } = useSelector(
    (state: RootState) => state.workoutState
  );
  const historyRecords = useSelector(
    (state: RootState) => state.widgetsManager.calendarWidget.previewRecords
  );
  const { timer, active } = useSelector((state: RootState) => {
    return state.workoutState.restTimer;
  });

  const toggleState = useSelector((state: RootState) => {
    return state.styleManager.toggleState;
  });
  const notificationVisibility = useSelector((state: RootState) => {
    return state.widgetsManager.notificationManager.visibility;
  });
  const { errorModal } = useSelector((state: RootState) => {
    return state.modalsManager;
  });
  const explorePreviewVisibility = useSelector((state: RootState) => {
    return state.styleManager.explorePreviewVisibility;
  });

  const { mainHeaderContent, subHeaderContent, centered } = useSelector(
    (state: RootState) => {
      return state.styleManager.headers;
    }
  );

  // UseEffect: User Data Manager
  useEffect(() => {
    switch (fetchedData) {
      case "TOKEN_NOT_FOUND":
        navigate("/auth/login");
        break;
      case "TOKEN_EXPIRED":
        // Create a modal showing that the session has expired.
        console.log("Token expired.");
        break;
      case "USER_NOT_FOUND":
        navigate("/auth/login");
        break;
      case "SERVER_ERROR":
        // Create a modal that tells something went wrong.
        console.log("Someting went wrong!");
        break;
      case "FETCH_ERROR":
        // Create a modal that tells something went wrong.
        console.log("Fetch error!");
        break;
      default:
        const userData = fetchedData as UserData;
        dispatch(setLoadedUserData(userData));
    }
  }, [dispatch]);

  // UseEffect: Timers & Duration Management
  useEffect(() => {
    let durationInterval: any;
    let restTimerInterval: any;
    if (workoutActivity) {
      durationInterval = setInterval(() => {
        dispatch(incrementWorkoutDuration());
      }, 1000);
    }

    if (active) {
      restTimerInterval = setInterval(() => {
        dispatch(decreaseRestTimer());
      }, 1000);
      if (timer <= 0) {
        dispatch(setRestTimerState({ activity: false }));
      }
    }

    return () => {
      if (durationInterval) {
        clearInterval(durationInterval);
      }
      if (restTimerInterval) {
        clearInterval(restTimerInterval);
      }
    };
  }, [dispatch, active, timer, workoutActivity]);

  // useEffect: Essentials Updating Manager
  useEffect(() => {
    const updateEssentialsData = async function () {
      try {
        const response = await fetch(`${mainAPIPath}/ess/update`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            todayEss: { ...todayEssData },
            yesterdayEss: { ...yesterdayEssData },
          }),
        });

        if (response.ok) {
          const data: {
            essentialsToday: Essentials;
            essentialsYesterday: Essentials;
          } = await response.json();

          dispatch(
            setLoadedEssentialsData({
              todayEss: data.essentialsToday,
              yesterdayEss: data.essentialsYesterday,
            })
          );
          console.log("Content updated!");
        } else {
          console.log("NOT UPDATED!");
        }
      } catch {
        console.log("SOMETHING WENT WRONG!");
      }
    };

    const automaticUpdater = setTimeout(() => {
      if (!updated) {
        updateEssentialsData();
      }
    }, 15000);

    return () => {
      clearTimeout(automaticUpdater);
    };
  }, [todayEssData, yesterdayEssData, updated]);

  // useEffect: Explore Infinitive Scroll
  const scrollTracker = useRef<HTMLDivElement>(null);
  const [fetchingState, setFetchingState] = useState(false);
  const { resetedFetching, fetchEnd, filterOptions } = useSelector(
    (state: RootState) => state.exploreState
  );

  const { exploreOption, category, duration, contentType, keywords } =
    filterOptions;

  useEffect(() => {
    const handleScroll = () => {
      if (
        !fetchEnd &&
        scrollTracker.current &&
        scrollTracker.current.scrollHeight -
          scrollTracker.current.clientHeight <=
          scrollTracker.current.scrollTop &&
        !fetchingState &&
        centered
      ) {
        console.log("Fetched upon scrolling.");
        fetchCards();
      }
    };

    if (scrollTracker.current) {
      scrollTracker.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollTracker.current) {
        scrollTracker.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [filterOptions, fetchEnd, fetchingState]);

  useEffect(() => {
    if (resetedFetching) {
      fetchCount = 1;
      console.log("Fetched upon filter change.");
      fetchCards();
      dispatch(setResetState(false));
    }
  }, [resetedFetching]);

  const fetchCards = async function () {
    setFetchingState(true);
    dispatch(setLoadingState(true));

    const modeModif = exploreOption.toLowerCase().replace(/\s/g, "_");
    const categoryModif = category.replace(/\s/g, "_").replace(/&/g, "and");
    const durationModif =
      duration !== "Set Duration" ? duration.replace(/\s/g, "_") : "";
    const typeModif =
      contentType !== "Set Content Type" ? contentType.toLowerCase() : "";
    const keywordsModif = keywords !== "" ? keywords.toLowerCase() : "";

    try {
      const response = await fetch(
        `${mainAPIPath}/explore/fetch-data?fetchCount=${fetchCount}&mode=${modeModif}&category=${categoryModif}&duration=${durationModif}&type=${typeModif}&keywords=${keywordsModif}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (response.ok) {
        const data: { cards: ExploreCardsI[] } = await response.json();
        dispatch(addLoadedCards(data.cards));
        fetchCount++;
      } else {
        dispatch(setFetchError(true));
      }
    } catch (error) {
      dispatch(setFetchError(true));
    } finally {
      setFetchingState(false);
      dispatch(setLoadingState(false));
    }
  };

  return (
    <div className={styles["display-wrapper"]}>
      <NavigationBar />
      {notificationVisibility && <NotificationBar />}
      {errorModal.visibility && <ErrorModal properties={errorModal} />}
      {(historyRecords.workoutRecords.length > 0 ||
        historyRecords.sessionRecords.length > 0) && <HistoryPreviewModal />}
      <main
        className={styles["content-wrapper"]}
        style={{ width: !toggleState ? "80%" : "" }}
        ref={scrollTracker}
      >
        {workoutVisibility ? (
          <div className={styles.tracker}>
            <WorkoutTracker />
          </div>
        ) : (
          <React.Fragment>
            {!explorePreviewVisibility && (
              <div
                className={styles.headings}
                style={
                  centered
                    ? { alignSelf: "center", textAlign: "center" }
                    : undefined
                }
              >
                <h1>{mainHeaderContent}</h1>
                <h3>{subHeaderContent}</h3>
              </div>
            )}

            <div
              className={styles["page-content"]}
              style={explorePreviewVisibility ? { height: "100%" } : undefined}
            >
              {pageLoading.state === "loading" ? <LoadingPlane /> : <Outlet />}
            </div>
          </React.Fragment>
        )}
        {workoutActivity && (
          <button
            className={styles["minimize-button"]}
            onClick={() => {
              navigate("/app/dashboard");
              dispatch(setWorkoutState({ visibility: !workoutVisibility }));
            }}
          >
            <MinimizeIcon />
          </button>
        )}
      </main>
    </div>
  );
}

export default RootLayout;

interface UserData {
  email: string;
  personalDetails: {
    firstName: string;
    lastName: string;
    sex: string;
    profilePicture: string;
    weight: number;
  };
  preferences: {
    selectedActivities: string[];
    fitnessLevel: string;
    frequencyStatus: string;
    fitnessGoal: string;
  };
  routines: {
    _id: string;
    userId: string;
    title: string;
    category: string;
    description: string;
    duration: number;
    exercises: FetchedExercise[];
  }[];
  explorations: {
    _id: string;
    title: string;
    category: string;
    duration: number;
    image: string;
    content: { description: string };
  }[];
}

export async function appDataLoader(): Promise<string | UserData> {
  const token = getToken();
  if (!token) {
    return "TOKEN_NOT_FOUND";
  } else if (token === "TOKEN_EXPIRED") {
    return "TOKEN_EXPIRED";
  }

  try {
    const response = await fetch(`${mainAPIPath}/app/user-data`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    console.log(data);

    if (response.status === 200) {
      return data.userData || null;
    } else if (response.status === 404) {
      return "USER_NOT_FOUND";
    } else {
      return "SERVER_ERROR";
    }
  } catch (error) {
    return "FETCH_ERROR";
  }
}

export let fetchCount = 2;
