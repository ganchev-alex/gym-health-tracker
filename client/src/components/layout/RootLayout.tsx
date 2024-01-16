import { useEffect } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import NavigationBar from "../UI/navigation_bar/NavigationBar";

import styles from "./RootLayout.module.css";
import { getToken } from "../../util/auth";
import { mainAPIPath } from "../../App";
import { setLoadedUserData } from "../../features/user-actions";

function RootLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fetchedData = useLoaderData();

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
  }, [fetchedData, navigate, dispatch]);

  return (
    <div className={styles["display-wrapper"]}>
      <NavigationBar />
      <main className={styles["content-wrapper"]}>
        {/* <h1>Welcome Back, Megan!</h1>
        <h3>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h3> */}
        <Outlet />
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
}

export async function appDataLoader(): Promise<string | AppData> {
  const token = getToken();
  if (!token) {
    return "TOKEN_NOT_FOUND";
  } else if (token === "TOKEN_EXPIRED") {
    return "TOKEN_EXPIRED";
  }

  try {
    const response = await fetch(`${mainAPIPath}/app/userData`, {
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
