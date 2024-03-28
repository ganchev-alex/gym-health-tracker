import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";

import { RootState } from "../../../features/store";
import { selectMode, setAuth } from "../../../features/user-actions";
import { setLoadingState } from "../../../features/loading-actions";
import {
  setErrorModalVisibility,
  setErrorModalState,
} from "../../../features/modals";

import enheritedStyles from "./SignInForm.module.css";
import styles from "./ProfileForm.module.css";

import defaultPic1 from "../../../assets/images/default_pic_1.png";
import defaultPic2 from "../../../assets/images/default_pic_2.png";
import defaultPic3 from "../../../assets/images/default_pic_3.png";
import defaultPic4 from "../../../assets/images/default_pic_4.png";
import { deleteToken, setToken } from "../../../util/auth";

const defaultPictures = [defaultPic1, defaultPic2, defaultPic3, defaultPic4];

const ProfileForm: React.FC = function () {
  const navigate = useNavigate();
  const authData = useSelector((state: RootState) => {
    return state.userActions.auth;
  });

  const dispatch = useDispatch();
  const sex = useSelector((state: RootState) => {
    return state.userActions.sex;
  });

  const [customProfilePicture, setCustomProfilePicture] = useState<
    Blob | undefined
  >(undefined);
  const [defaultProfilePicture, setDefaultProfilePicture] =
    useState<string>(defaultPic1);

  const {
    value: firstName,
    errorState: firstNameErrorState,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput((value) => value.trim().length > 0 && !/\d/.test(value));

  const {
    value: lastName,
    errorState: lastNameErrorState,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput((value) => value.trim().length > 0 && !/\d/.test(value));

  const {
    value: age,
    errorState: ageErrorState,
    valueChangeHandler: ageChangeHandler,
    inputBlurHandler: ageBlurHandler,
  } = useInput((value) => Number(value) > 10, "0");

  const {
    value: weight,
    errorState: weightErrorState,
    valueChangeHandler: weightChangeHandler,
    inputBlurHandler: weightBlurHandler,
  } = useInput((value) => Number(value) > 0, "0");

  const {
    value: height,
    errorState: heightErrorState,
    valueChangeHandler: heightChangeHandler,
    inputBlurHandler: heightBlurHandler,
  } = useInput((value) => Number(value) > 0, "0");

  useEffect(() => {
    if (authData.email == "") {
      navigate("/auth");
    }
    const localSex = localStorage.getItem("userSex");
    if (localSex) {
      dispatch(selectMode(localSex));
    }
  }, [sex]);

  const sexHandler = function (event: React.ChangeEvent<HTMLInputElement>) {
    dispatch(selectMode(event.target.checked ? "female" : "male"));
    localStorage.setItem("userSex", event.target.checked ? "female" : "male");
  };

  const onPicSelect = function (event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setCustomProfilePicture(event.target.files[0]);
    }
  };

  const submissionHandler = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const fetchDefaultProfilePic = async function (imageSrc: string) {
      const response = await fetch(imageSrc);
      const fileBlob = await response.blob();
      return fileBlob;
    };

    let selectedDefaultPicture;
    if (!customProfilePicture) {
      try {
        dispatch(setLoadingState(true));
        selectedDefaultPicture = await fetchDefaultProfilePic(
          defaultProfilePicture
        );
      } catch (error) {
        dispatch(setAuth({ email: "", password: "" }));
        dispatch(
          setErrorModalState({
            responseCode: 400,
            title: "Unexpected Error!",
            details:
              "Image conversion failed. Please try again! If your continue encountering this issue don't hesitated and contact us.",
            label: "Try Again",
            redirectionRoute: "/auth",
          })
        );
        dispatch(setErrorModalVisibility(true));
      } finally {
        dispatch(setLoadingState(false));
      }
    }

    const personalDetails = {
      firstName,
      lastName,
      age: Number(age),
      sex,
      weight: Number(weight),
      height: Number.isInteger(Number(height))
        ? Number(height) / 100
        : Number(height),
    };

    const userData = new FormData();
    Object.entries(authData).forEach(([key, value]) => {
      userData.append(key, value);
    });
    Object.entries(personalDetails).forEach(([key, value]) => {
      userData.append(key, value.toString());
    });
    if (customProfilePicture) {
      userData.append("profilePicture", customProfilePicture);
    } else if (selectedDefaultPicture) {
      const defaultImageFile = new File(
        [selectedDefaultPicture],
        "default_image.png",
        { type: "image/png" }
      );
      userData.append("profilePicture", defaultImageFile);
    }

    const createAcount = async function () {
      dispatch(setLoadingState(true));
      try {
        const response = await fetch("http://localhost:8080/auth/sign-in", {
          method: "POST",
          body: userData,
        });
        const data = await response.json();
        if (response.status == 201) {
          setToken(data.token);
          navigate("/auth/personalization");
        } else if (response.status == 422) {
          const validationErrors: string[] = data.errors;
          let detailsDescription = "";
          validationErrors.forEach((error) => {
            detailsDescription += error + " ";
          });
          dispatch(
            setErrorModalState({
              responseCode: 422,
              title: "Compromized Validation!",
              details: `It seems like you've made a request with invalid data. Please make a new request following the provided steps of the forms you are filling in. Details: ${detailsDescription}`,
              label: "Try Again",
              redirectionRoute: "/auth",
            })
          );
          dispatch(setAuth({ email: "", password: "" }));
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

    createAcount();
  };

  const preventEnter = function (event: React.KeyboardEvent) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  };

  const numbersValidation =
    ageErrorState || weightErrorState || heightErrorState;

  const formValidation =
    numbersValidation || firstNameErrorState || lastNameErrorState;

  return (
    <form onSubmit={submissionHandler}>
      <header className={enheritedStyles["header-wrapper"]}>
        <h3>Create Profile</h3>
        <p>
          Changed your mind?{" "}
          <Link
            to={"/auth"}
            onClick={() => {
              dispatch(setAuth({ email: "", password: "" }));
              deleteToken();
            }}
          >
            Cancel
          </Link>
        </p>
      </header>
      <div className={styles["pic-selector"]}>
        <img
          className={styles["selected-pic"]}
          src={
            customProfilePicture
              ? URL.createObjectURL(customProfilePicture)
              : defaultProfilePicture
          }
        />
        <div className={styles.controlls}>
          <div className={styles["default-selector"]}>
            {defaultPictures.map((path, index) => {
              return (
                <img
                  key={index}
                  src={path}
                  onClick={() => {
                    setDefaultProfilePicture(path);
                    setCustomProfilePicture(undefined);
                  }}
                />
              );
            })}
          </div>
          <div className={styles["upload-button"]}>
            <input
              type="file"
              name="customProfilePic"
              accept="image/*"
              onChange={onPicSelect}
            />
            Upload Profile Picture
          </div>
        </div>
      </div>
      <p className={enheritedStyles.divider}>personal details</p>
      <div className={enheritedStyles.inputs}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={firstName}
          onChange={firstNameChangeHandler}
          onBlur={firstNameBlurHandler}
          onKeyDown={preventEnter}
        />
        {firstNameErrorState && (
          <p className={enheritedStyles["error-message"]}>
            This field cannot be empty or contain any numbers!
          </p>
        )}
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={lastName}
          onChange={lastNameChangeHandler}
          onBlur={lastNameBlurHandler}
          onKeyDown={preventEnter}
        />
        {lastNameErrorState && (
          <p className={enheritedStyles["error-message"]}>
            This field cannot be empty or contain any numbers!
          </p>
        )}
      </div>
      <p className={enheritedStyles.divider}>measurments</p>
      <div className={styles["inputs-wrapper"]}>
        <div className={styles["number-input"]}>
          <label htmlFor="age">Age: </label>
          <input
            type="number"
            name="age"
            value={age}
            id="age"
            min={10}
            max={99}
            onChange={ageChangeHandler}
            onBlur={ageBlurHandler}
            onKeyDown={preventEnter}
          />
        </div>
        <div className={styles["number-input"]}>
          <div>
            <label htmlFor="heigth">Heigth: </label>
            <input
              type="number"
              name="height"
              id="height"
              value={height}
              step="any"
              onChange={heightChangeHandler}
              onBlur={heightBlurHandler}
              onKeyDown={preventEnter}
            />
          </div>
          <span>m.</span>
        </div>
        <div className={styles["sex-wrapper"]}>
          <label htmlFor="sex">Sex: </label>
          <div className={styles["toggle-wrapper"]}>
            <span>m</span>
            <div className={styles["toggle-switch"]}>
              <input
                type="checkbox"
                name="sex"
                id="sex"
                checked={sex === "female"}
                onChange={sexHandler}
                onKeyDown={preventEnter}
              />
            </div>
            <span>f</span>
          </div>
        </div>
        <div className={styles["number-input"]}>
          <div>
            <label htmlFor="weigth">Weigth: </label>
            <input
              type="number"
              name="weight"
              id="weight"
              value={weight}
              step="any"
              onChange={weightChangeHandler}
              onBlur={weightBlurHandler}
              onKeyDown={preventEnter}
            />
          </div>
          <span>kg.</span>
        </div>
      </div>
      {numbersValidation && (
        <p className={enheritedStyles["error-message"]}>
          You have provided invalid measurments or age.
        </p>
      )}
      <button
        type="submit"
        className={enheritedStyles["submit-button"]}
        disabled={formValidation}
      >
        Submit
      </button>
    </form>
  );
};

export default ProfileForm;
