import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { setLoadingState } from "../../../features/loading-actions";
import useInput from "../../../hooks/useInput";
import { getToken, setToken } from "../../../util/auth";
import { mainAPIPath } from "../../../App";

import {
  setErrorModalVisibility,
  setErrorModalState,
} from "../../../features/modals";

import styles from "./SignInForm.module.css";

import GoogleIcon from "../../../assets/svg_icon_components/GoogleIcom";

const LogInForm: React.FC = function () {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [credentialsError, setCredentialsError] = useState<string | null>(null);

  const {
    value: email,
    validationStatus: emailValidationStatus,
    errorState: emailErrorState,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput((value) => {
    return value.trim().length > 6 && value.includes("@");
  });

  const {
    value: password,
    validationStatus: passwordValidationStatus,
    errorState: passwordErrorState,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput((value) => {
    return value.trim().length >= 8;
  });

  const token = getToken();
  useEffect(() => {
    if (token && token != "TOKEN_EXPIRED") {
      navigate("/app/dashboard");
    }
  }, [token]);

  const submissionHandler = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const auth = {
      email: email.trim(),
      password: password.trim(),
    };

    const login = async function () {
      dispatch(setLoadingState(true));

      try {
        const response = await fetch(`${mainAPIPath}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(auth),
        });
        const data = await response.json();

        if (response.status === 200) {
          const token = data.token;
          setToken(token);
          navigate("/app/dashboard");
        } else if (response.status === 401) {
          setCredentialsError("Wrong email or password! Please try again.");
          resetPassword();
        } else if (response.status === 422) {
          dispatch(
            setErrorModalState({
              responseCode: 422,
              title: "Invalid Validation!",
              details: `It seems like you've made a request with invalid data. Please make sure you are providing a valid email and your password is 8-20 characters.`,
              label: "Ok",
              redirectionRoute: "/auth",
            })
          );
          dispatch(setErrorModalVisibility(true));
          resetEmail();
          resetPassword();
        } else {
          dispatch(
            setErrorModalState({
              responseCode: response.status,
              title: "Something went wrong!",
              details:
                "It is not you, it's us! A server side error has occured. Please try again and if you continue to encounter this issue, don't hesitate and contact us.\n\nDetails: " +
                data.error,
              label: "Try Again",
              redirectionRoute: "/auth",
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

    login();
  };

  const preventEnter = function (event: React.KeyboardEvent) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={submissionHandler}>
      <header className={styles["header-wrapper"]}>
        <h3>Welocome back!</h3>
        <p>
          Don't have an account? <Link to={"/auth"}>Sign In</Link>
        </p>
      </header>
      <button className={styles["google-button"]}>
        <GoogleIcon /> Log in with Google
      </button>
      <p className={styles.divider}>or sign in with email</p>
      <div className={styles.inputs}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={emailChangeHandler}
          onClick={() => setCredentialsError("")}
          onBlur={emailBlurHandler}
          className={emailErrorState ? styles["input-error"] : ""}
          autoComplete="email"
          onKeyDown={preventEnter}
        />
        {emailErrorState && (
          <p className={styles["error-message"]}>Provide a valid email!</p>
        )}
        {credentialsError && (
          <p className={styles["error-message"]}>{credentialsError}</p>
        )}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          className={passwordErrorState ? styles["input-error"] : ""}
          autoComplete="current-password"
          onKeyDown={preventEnter}
        />
        {passwordErrorState && (
          <p className={styles["error-message"]}>
            The password must be between 8-20 characters.
          </p>
        )}
      </div>
      <button
        type="submit"
        className={styles["submit-button"]}
        disabled={!(emailValidationStatus && passwordValidationStatus)}
      >
        Log In
      </button>
    </form>
  );
};

export default LogInForm;
