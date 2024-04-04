import { useNavigate, useParams } from "react-router-dom";
import useInput from "../../../hooks/useInput";

import inheritedStyles from "./SignInForm.module.css";
import { mainAPIPath } from "../../../App";
import { useDispatch } from "react-redux";
import { setErrorModalState } from "../../../features/modals";
import { setLoadingState } from "../../../features/loading-actions";

const ChangePassword = function () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const urlParams = new URLSearchParams(window.location.search);
  const expiration = urlParams.get("expiration");
  const expired = expiration ? new Date(expiration) < new Date() : true;
  const { userId } = useParams();

  const isMale = localStorage.getItem("userSex");

  const {
    value: currantPassword,
    validationStatus: currantPasswordValidationStatus,
    errorState: currantPasswordErrorState,
    valueChangeHandler: currantPasswordChangeHandler,
    inputBlurHandler: currantPasswordBlurHandler,
  } = useInput((value) => {
    return value.trim().length >= 8;
  });

  const {
    value: newPassword,
    validationStatus: newPasswordValidationStatus,
    errorState: newPasswordErrorState,
    valueChangeHandler: newPasswordChangeHandler,
    inputBlurHandler: newPasswordBlurHandler,
  } = useInput((value) => {
    return value.trim().length >= 8 && value.trim().length <= 20;
  });

  const {
    value: passwordCheck,
    validationStatus: passwordCheckValidationStatus,
    errorState: passwordCheckErrorState,
    valueChangeHandler: passwordCheckChangeHandler,
    inputBlurHandler: passwordCheckBlurHandler,
  } = useInput((value) => {
    return value.trim() === newPassword.trim();
  });

  const sumbitHandler = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (expired) {
      return navigate("/auth/login");
    }

    try {
      dispatch(setLoadingState(true));
      const response = await fetch(
        `${mainAPIPath}/account/change-password?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: currantPassword,
            newPassword,
            passwordCheck,
          }),
        }
      );

      switch (response.status) {
        case 200:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Password Changed Successfully!",
              details:
                "You have succesfully changed your password. In order to access your account please log in.",
              label: "Log In",
              redirectionRoute: "/auth/login",
            })
          );
        case 401:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Incorrect Currant Password!",
              details:
                "Your currant password does not match the one you have provided. Please try again.",
              label: "Try again",
              redirectionRoute: ".",
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
    <form onSubmit={sumbitHandler}>
      <header className={inheritedStyles["header-wrapper"]}>
        <h3>Change Password</h3>
        <p>
          {expired
            ? "Your change password link has expired. Please log in and make a new one if you still want to change your password"
            : "Create a new password for your account."}
        </p>
      </header>
      <p className={inheritedStyles.divider}>new password</p>
      {!expired && (
        <div className={inheritedStyles.inputs}>
          <label htmlFor="currantPassword">Currant password</label>
          <input
            id="currantPassword"
            type="password"
            name="currantPassword"
            value={currantPassword}
            onChange={currantPasswordChangeHandler}
            onBlur={currantPasswordBlurHandler}
            className={
              newPasswordErrorState ? inheritedStyles["input-error"] : ""
            }
            autoComplete="email"
            onKeyDown={preventEnter}
          />
          {currantPasswordErrorState && (
            <p className={inheritedStyles["error-message"]}>
              Your currant password must be over 8 characters!
            </p>
          )}
          <label htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={newPasswordChangeHandler}
            onBlur={newPasswordBlurHandler}
            className={
              newPasswordErrorState ? inheritedStyles["input-error"] : ""
            }
            autoComplete="email"
            onKeyDown={preventEnter}
          />
          {newPasswordErrorState && (
            <p className={inheritedStyles["error-message"]}>
              Your new password must be form 8 to 20 characters!
            </p>
          )}
          <label htmlFor="passwordCheck">Repeat password</label>
          <input
            id="passwordCheck"
            type="password"
            name="passwordCheck"
            value={passwordCheck}
            onChange={passwordCheckChangeHandler}
            onBlur={passwordCheckBlurHandler}
            className={
              passwordCheckErrorState ? inheritedStyles["input-error"] : ""
            }
            autoComplete="email"
            onKeyDown={preventEnter}
          />
          {passwordCheckErrorState && (
            <p className={inheritedStyles["error-message"]}>
              Passwords do not match!
            </p>
          )}
        </div>
      )}
      <button
        type="submit"
        className={inheritedStyles["submit-button"]}
        disabled={
          expired
            ? false
            : !(
                currantPasswordValidationStatus &&
                newPasswordValidationStatus &&
                passwordCheckValidationStatus
              )
        }
      >
        {expired ? "Log In" : "Change Password"}
      </button>
      {!expired && (
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
      )}
    </form>
  );
};

export default ChangePassword;
