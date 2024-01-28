import React, { useEffect } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
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
import { setWorkoutVisibility } from "../../features/workout";
import NotificationBar from "../UI/Notification/Notification";
import ErrorModal from "../UI/ErrorModal/ErrorModal";

function RootLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchedData = useLoaderData();

  const loadedUserData = useSelector(
    (state: RootState) => state.userActions.loadedUserData
  );

  const { errorModal } = useSelector((state: RootState) => {
    return state.modalsManager;
  });

  const toggleState = useSelector((state: RootState) => {
    return state.navigation.toggleState;
  });

  const { isActive: isWorkoutActive, isShown } = useSelector(
    (state: RootState) => state.workoutState
  );

  const notificationVisibility = useSelector((state: RootState) => {
    return state.widgetsManager.notificationManager.visibility;
  });

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
        const appData = fetchedData as AppData;
        dispatch(setLoadedUserData(appData));
    }
  }, [fetchedData, navigate, dispatch, toggleState]);

  return (
    <div className={styles["display-wrapper"]}>
      <NavigationBar />
      {notificationVisibility && <NotificationBar />}
      {errorModal.visibility && <ErrorModal properties={errorModal} />}
      <main
        className={styles["content-wrapper"]}
        style={{ width: !toggleState ? "80%" : "" }}
      >
        {isShown ? (
          <div className={styles.tracker}>
            <WorkoutTracker />
          </div>
        ) : (
          <React.Fragment>
            <div className={styles.headings}>
              <h1>Welcome Back, {loadedUserData.personalDetails.firstName}!</h1>
              <h3>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h3>
            </div>
            <div className={styles["page-content"]}>
              <Outlet />
            </div>
          </React.Fragment>
        )}
        {isWorkoutActive && (
          <button
            className={styles["minimize-button"]}
            onClick={() => {
              navigate("/app/workouts");
              dispatch(setWorkoutVisibility());
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

interface AppData {
  auth: { email: string };
  personalDetails: {
    firstName: string;
    lastNamee: string;
    sex: string;
    profilePicture: string;
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
}

export async function appDataLoader(): Promise<string | AppData> {
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

    if (response.status === 200) {
      return data.appData || null;
    } else if (response.status === 404) {
      return "USER_NOT_FOUND";
    } else {
      return "SERVER_ERROR";
    }
  } catch (error) {
    return "FETCH_ERROR";
  }
}
