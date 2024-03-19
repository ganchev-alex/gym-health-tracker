import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { RootState } from "../../../features/store";
import { setLoadingState } from "../../../features/loading-actions";
import {
  setErrorModalVisibility,
  setErrorModalState,
} from "../../../features/modals";
import { getToken } from "../../../util/auth";
import { mainAPIPath } from "../../../App";

import enheritedStyles from "./SignInForm.module.css";
import styles from "./PersonalizationForm.module.css";

const activitesLabels = [
  "Gym & Weightlifting",
  "Cardio",
  "Yoga",
  "Stretching",
  "Meditation",
  "Cross Fit",
];

const fitnessLevelOptions = [
  "Inactive",
  "Beginner",
  "Moderate",
  "Active",
  "Very Active",
];

const frequencyOptions = [
  "1-2 times a week",
  "3-4 times a week",
  "5-6 times a week",
  "Daily",
  "Variable, depending on energy levels",
  "As time permits (depending on schedule)",
  "I prefer spontaneous workouts",
];

const goalsOptions = [
  "Muscle & Weigth Gain",
  "Muscle & Weigth Lost",
  "Tone and Define Muscles",
  "Improved Cardiovascular Health",
  "Increased Flexibility",
  "Improve Overall Health",
  "Stress Relief and Relaxation",
  "Enhance Mental Well-being",
  "Maintain Current Fitness Level",
  "Open to everything.",
];

const PersonalDetails: React.FC = function () {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fitnessLevel, setFitnessLevel] = useState("");
  const [frequencyStatus, setFrequencyStatus] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  let isAllActivites = !(selectedActivities.length !== 0);

  const themeMode = useSelector((state: RootState) => {
    return state.userActions.sex;
  });

  const styleChecker = localStorage.getItem("userSex") || themeMode;

  const token = getToken();
  const authDataValidator = useSelector((state: RootState) => {
    return state.userActions.auth.email;
  });

  useEffect(() => {
    if (!token || token == "TOKEN_EXPIRED" || authDataValidator === "") {
      navigate("/auth");
    }
  }, [token]);

  const onSelectActivity = function (label: string) {
    if (selectedActivities.includes(label)) {
      setSelectedActivities((previousState) => {
        return previousState.filter((value) => {
          return label !== value;
        });
      });
    } else {
      setSelectedActivities((previosState) => {
        return [...previosState, label];
      });
    }
  };

  const onSetPrefernce = function (
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const preference = event.target.name;
    switch (preference) {
      case "fitnessLevel":
        setFitnessLevel(event.target.value);
        break;
      case "frequencyStatus":
        setFrequencyStatus(event.target.value);
        break;
      case "fitnessGoal":
        setFitnessGoal(event.target.value);
    }
  };

  const onSelectAll = function () {
    setSelectedActivities([]);
  };

  const submissionHandler = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userPreferences = {
      selectedActivities,
      fitnessLevel,
      frequencyStatus,
      fitnessGoal,
    };
    const sendUserData = async function () {
      dispatch(setLoadingState(true));
      try {
        const response = await fetch(`${mainAPIPath}/auth/set-preferences`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userPreferences),
        });

        if (response.status == 204) {
          navigate("/app");
          localStorage.removeItem("userSex");
        } else if (response.status == 404) {
          dispatch(
            setErrorModalState({
              responseCode: 404,
              title: "User not found!",
              details:
                "The token stored on your machine is invalid or missing. Try to login again and if you continue to experience this error reach out to us.",
              label: "Log In",
              redirectionRoute: "/auth/login",
            })
          );
          dispatch(setErrorModalVisibility(true));
        }
      } catch (error) {
        dispatch(
          setErrorModalState({
            responseCode: 400,
            title: "Failed connection",
            details:
              "It seems like your request didn't go through. Make sure you are connected to the internet and try again.",
            label: "Try Again",
            redirectionRoute: "/auth",
          })
        );
        dispatch(setErrorModalVisibility(true));
      } finally {
        dispatch(setLoadingState(false));
      }
    };
    sendUserData();
  };

  return (
    <form onSubmit={submissionHandler}>
      <header className={enheritedStyles["header-wrapper"]}>
        <h3>Personalize</h3>
        <p>You are almost finished!</p>
      </header>
      <p className={styles.description}>
        Help us manage your profile better! By setting up preferences GymPal
        will be able to offer you workouts and activities just for you. By doing
        so you will be exposed to a variety of premade workouts, tips and in
        general better experience when using the application.
      </p>
      <p className={enheritedStyles.divider}>personal details</p>
      <div
        className={`${styles["survey-wrapper"]} ${
          styleChecker === "male"
            ? styles["male-theme"]
            : styles["female-theme"]
        }`}
      >
        <label htmlFor="fitnessLevel">
          How would you describe your current fitness level?
        </label>
        <select
          name="fitnessLevel"
          id="fitnessLevel"
          defaultValue=""
          required
          onChange={onSetPrefernce}
        >
          <option value="" disabled hidden>
            Select your fitness level...
          </option>
          {fitnessLevelOptions.map((option, index) => {
            return (
              <option value={option} key={index}>
                {option}
              </option>
            );
          })}
        </select>
        <label htmlFor="frequencyStatus">
          How often do you (wish to) workout?
        </label>
        <select
          name="frequencyStatus"
          id="frequencyStatus"
          defaultValue=""
          required
          onChange={onSetPrefernce}
        >
          <option value="" disabled hidden>
            Select your frequency...
          </option>
          {frequencyOptions.map((option, index) => {
            return (
              <option value={option} key={index}>
                {option}
              </option>
            );
          })}
        </select>
        <label htmlFor="fitnessGoal">What are you fitness goals?</label>
        <select
          name="fitnessGoal"
          id="fitnessGoal"
          defaultValue=""
          required
          onChange={onSetPrefernce}
        >
          <option value="" disabled hidden>
            Select your goal...
          </option>
          {goalsOptions.map((option, index) => {
            return (
              <option value={option} key={index}>
                {option}
              </option>
            );
          })}
        </select>
        <p>What activities are you interested in?</p>
        <div
          className={`${styles["tags-wrapper"]} ${
            themeMode === "male" ? styles["male-theme"] : styles["female-theme"]
          }`}
        >
          <button
            className={isAllActivites ? styles.active : styles.inactive}
            onClick={onSelectAll}
            type="button"
          >
            Open to everything
          </button>
          {activitesLabels.map((label, index) => {
            return (
              <button
                key={index}
                className={
                  selectedActivities.includes(label)
                    ? styles.active
                    : styles.inactive
                }
                onClick={() => onSelectActivity(label)}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      <button type="submit" className={enheritedStyles["submit-button"]}>
        Finish up
      </button>
    </form>
  );
};

export default PersonalDetails;
