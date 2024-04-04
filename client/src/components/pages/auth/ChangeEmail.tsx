import { useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";

import inheritedStyles from "./SignInForm.module.css";
import { getToken } from "../../../util/auth";
import { mainAPIPath } from "../../../App";
import { useDispatch } from "react-redux";
import { setLoadingState } from "../../../features/loading-actions";
import { setErrorModalState } from "../../../features/modals";

const ChangeEmail = function () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    value: email,
    validationStatus: emailValidationStatus,
    errorState: emailErrorState,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => {
    return value.trim().length > 6 && value.includes("@");
  });

  const isMale = localStorage.getItem("userSex");

  const submitHandler = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      dispatch(setLoadingState(true));
      const response = await fetch(`${mainAPIPath}/account/change-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          email,
        }),
      });

      switch (response.status) {
        case 201:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Email Changed Successfully!",
              details:
                "You have succesfully changed your email. In order to access your account please log in.",
              label: "Log In",
              redirectionRoute: "/auth/login",
            })
          );
        case 401:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Session expired!",
              details:
                "It seems like your session has expired. Please login and try changing your email again.",
              label: "Log In",
              redirectionRoute: "/auth/login",
            })
          );
        case 422:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Compromized validation!",
              details:
                "It seems like you've made a request with invalid data. Please follows the step provided by the application when submitting your data and try again.",
              label: "Take me back",
              redirectionRoute: ".",
            })
          );
        default:
        case 404:
        case 500:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Internal Server Error!",
              details:
                "It is not you, it is us! Something went wrong with the process of changing your password. Please try again and if you continue to experience this issue please reach out!",
              label: "Take me back",
              redirectionRoute: "/auth/login",
            })
          );
      }
    } catch {
      dispatch(
        setErrorModalState({
          responseCode: 400,
          title: "Failed connection",
          details:
            "It seems like your request didn't go through. Make sure you are connected to the internet and try again.",
          label: "Take me back",
          redirectionRoute: ".",
        })
      );
    } finally {
      dispatch(setLoadingState(false));
    }
  };

  const preventEnter = function (event: React.KeyboardEvent) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <header className={inheritedStyles["header-wrapper"]}>
        <h3>Email Change Up</h3>
        <p>Provide a new email that later on you will have to verify.</p>
      </header>
      <p className={inheritedStyles.divider}>new email</p>
      <div className={inheritedStyles.inputs}>
        <label htmlFor="newEmail">New e-mail</label>
        <input
          id="newEmail"
          type="email"
          name="newEmail"
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          className={emailErrorState ? inheritedStyles["input-error"] : ""}
          autoComplete="off"
          onKeyDown={preventEnter}
        />
        {emailErrorState && (
          <p className={inheritedStyles["error-message"]}>
            Provide a valid email!
          </p>
        )}
      </div>
      <button
        type="submit"
        className={inheritedStyles["submit-button"]}
        disabled={!emailValidationStatus}
      >
        Change Email
      </button>
      <button
        type="button"
        className={`${inheritedStyles["cancel-button"]} ${
          isMale === "female" ? inheritedStyles.female : inheritedStyles.male
        }`}
        onClick={() => {
          navigate("/auth/login");
        }}
      >
        Cancel
      </button>
    </form>
  );
};

export default ChangeEmail;
