import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoadingState } from "../../../features/loading-actions";

import { RootState } from "../../../features/store";
import {
  addActivite,
  removeActivite,
  selectAllActivities,
  setPreferences,
} from "../../../features/user-actions";
import {
  changeVisibility,
  setModuleData,
} from "../../../features/error-module";

import enheritedStyles from "./SignInForm.module.css";
import styles from "./PersonalizationForm.module.css";

// TODO: for better readability seperate the options in an array list and load them with a map function.

const activitesLabels = [
  "Gym & Weightlifting",
  "Cardio",
  "Yoga",
  "Mediation",
  "Swimming",
  "Running/Jogging",
  "Walking/Hiking",
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => {
    return state.userActions;
  });

  const profileDataVerifier = useSelector((state: RootState) => {
    return state.userActions.personalDetails.firstName;
  });

  const [fitnessLevel, setFitnessLevel] = useState("");
  const [frequencyStatus, setFrequencyStatus] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");

  useEffect(() => {
    if (profileDataVerifier == "") {
      navigate("/auth");
    }

    dispatch(setPreferences({ fitnessLevel, frequencyStatus, fitnessGoal }));
  }, [fitnessLevel, frequencyStatus, fitnessGoal]);

  const selectedActivities = useSelector((state: RootState) => {
    return state.userActions.selectedActivities;
  });
  let isAllActivites = !(selectedActivities.length !== 0);
  const themeMode = useSelector((state: RootState) => {
    return state.userActions.personalDetails.sex;
  });

  const onSelectActivity = function (label: string) {
    if (selectedActivities.includes(label)) {
      dispatch(removeActivite({ label }));
    } else {
      dispatch(addActivite({ label }));
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
        console.log("Changed value: ", fitnessGoal);
    }
  };

  const onSelectAll = function () {
    dispatch(selectAllActivities());
  };

  // On form submission create a profile on the backend and provide a loading spinner for the user.
  const submissionHandler = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    dispatch(setPreferences({ fitnessLevel, frequencyStatus, fitnessGoal }));
    // const sharedModuleData = {
    //   label1: "React Out",
    //   label2: "Try Again",
    //   action1: () => {
    //     navigate("/auth");
    //     dispatch(changeVisibility(false));
    //   },
    //   action2: () => {
    //     navigate("/auth");
    //     dispatch(changeVisibility(false));
    //   },
    // };
    const sendUserData = async function () {
      dispatch(setLoadingState(true));
      try {
        const response = await fetch("http://localhost:8080/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: JSON.stringify(userData),
        });
        const data = await response.json();

        if (response.status === 201) {
          console.log(data.message, "User ID", data.userId);
        } else if (response.status === 400) {
          // TODO: Wrong Validation input error Module.
          console.log(data.message, data.details);
        } else {
          // const moduleData = {
          //   responseCode: response.status,
          //   title: "Something went wrong!",
          //   details:
          //     "Unexpected server error! Please try again!\nIf you are continuing to experience this problem contact us",
          //   ...sharedModuleData,
          // };
          // dispatch(setModuleData(moduleData));
          // dispatch(changeVisibility(true));
          // console.log(data.error);
        }
      } catch (error) {
        // const moduleData = {
        //   responseCode: 500,
        //   title: "Something went wrong!",
        //   details:
        //     "It is not you, it is us! Please try again, and if you are continueing to experience this issue, check your e-mail for any notification related to the problem. Otherwise, please contact us!",
        //   ...sharedModuleData,
        // };
        // dispatch(setModuleData(moduleData));
        // dispatch(changeVisibility(true));
        console.log(error);
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
        <p>
          Changed your mind? <a>Cancel</a>
        </p>
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
          themeMode === "male" ? styles["male-theme"] : styles["female-theme"]
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
