import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { setAuth } from "../../../features/user-actions";
import { setLoadingState } from "../../../features/loading-actions";
import useInput from "../../../hooks/useInput";

import { RootState } from "../../../features/store";
import {
  changeErrorModalVisibility,
  setErrorModalState,
} from "../../../features/modals";
import { mainAPIPath } from "../../../App";

import styles from "./SignInForm.module.css";

import GoogleIcon from "../../../assets/svg_icon_components/GoogleIcom";

const SignInForm: React.FC = function () {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authDataValidator = useSelector((state: RootState) => {
    return state.userActions.auth;
  });

  const [errorCode, setErrorCode] = useState<number | null>(null);
  const [usedEmail, setUsedEmail] = useState("");

  const {
    value: email,
    validationStatus: emailValidationStatus,
    errorState: emailErrorState,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    setValue: setEmail,
  } = useInput((value) => {
    return value.trim().length > 6 && value.includes("@");
  });

  const {
    value: password,
    validationStatus: passwordValidationStatus,
    errorState: passwordErrorState,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    setValue: setPassword,
    reset: resetPassword,
  } = useInput((value) => {
    return value.trim().length >= 8 && value.trim().length <= 20;
  });

  useEffect(() => {
    const { email, password } = authDataValidator;
    if (email !== "") {
      setEmail(email);
      setPassword(password);
    }
  }, []);

  const submissionHandler = function (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const auth = {
      email: email.trim(),
      password: password.trim(),
    };

    const checkEmail = async function () {
      dispatch(setLoadingState(true));

      try {
        const response = await fetch(`${mainAPIPath}/auth/check-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: auth.email }),
        });
        const data = await response.json();

        if (response.status === 200) {
          dispatch(setAuth(auth));
          navigate("/auth/profile");
        } else if (response.status === 409) {
          setUsedEmail(data.email);
          setErrorCode(response.status);
          resetPassword();
        } else if (response.status === 422) {
          setErrorCode(response.status);
          resetPassword();
        } else {
          dispatch(setAuth({ email: "", password: "" }));
          dispatch(
            setErrorModalState({
              responseCode: response.status,
              title: "Something went wrong!",
              details:
                "It is not you, it's us! A server side error has occured. Please try again and if you continue to encounter this issue, don't hesitate and contact us.\n\nDetails: " +
                data.error.msg,
              label: "Try Again",
              redirectionRoute: "/auth",
            })
          );
          dispatch(changeErrorModalVisibility(true));
          console.log("500:", data);
        }
      } catch (error) {
        dispatch(setAuth({ email: "", password: "" }));
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
        dispatch(changeErrorModalVisibility(true));
      } finally {
        dispatch(setLoadingState(false));
      }
    };

    checkEmail();
  };

  function normalizeEmail(email: string) {
    email = email.toLowerCase();

    if (email.endsWith("@gmail.com")) {
      const parts = email.split("@");
      parts[0] = parts[0].replace(/\./g, "");
      email = parts.join("@");
    }

    return email;
  }

  const preventEnter = function (event: React.KeyboardEvent) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={submissionHandler}>
      <header className={styles["header-wrapper"]}>
        <h3>Get Started</h3>
        <p>
          Already have an account? <Link to="/auth/login">Log in</Link>
        </p>
      </header>
      <button className={styles["google-button"]}>
        <GoogleIcon /> Sign in with Google
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
          onBlur={emailBlurHandler}
          className={emailErrorState ? styles["input-error"] : ""}
          autoComplete="email"
          onKeyDown={preventEnter}
        />
        {emailErrorState && (
          <p className={styles["error-message"]}>
            Please provide a valid email!
          </p>
        )}
        {errorCode === 409 && usedEmail === normalizeEmail(email) && (
          <p className={styles["error-message"]}>
            This email is already in use. Please provide a different one!
          </p>
        )}
        {errorCode === 422 && (
          <p className={styles["error-message"]}>
            The e-mail you have provided is not valid!
          </p>
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
            Your password must be 8-20 characters.
          </p>
        )}
      </div>
      <button
        type="submit"
        className={styles["submit-button"]}
        disabled={
          !(emailValidationStatus && passwordValidationStatus) ||
          usedEmail === email
        }
      >
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
