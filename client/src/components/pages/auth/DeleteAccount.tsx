import { useNavigate, useParams } from "react-router-dom";
import useInput from "../../../hooks/useInput";

import inheritedStyles from "./SignInForm.module.css";
import { useDispatch } from "react-redux";
import { setLoadingState } from "../../../features/loading-actions";
import { mainAPIPath } from "../../../App";
import { setErrorModalState } from "../../../features/modals";
import { deleteToken } from "../../../util/auth";

const DeleteAccount = function () {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const urlParams = new URLSearchParams(window.location.search);
  const expiration = urlParams.get("expiration");
  const expired = expiration ? new Date(expiration) < new Date() : true;
  const { userId } = useParams();

  const isMale = localStorage.getItem("userSex");

  const {
    value: email,
    validationStatus: emailValidationStatus,
    errorState: emailErrorState,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => {
    return value.trim().length > 6 && value.includes("@");
  });

  const onSubmitHandler = async function (
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (expired) {
      return navigate("/auth/login");
    }

    try {
      dispatch(setLoadingState(true));
      const response = await fetch(
        `${mainAPIPath}/account/delete-account?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      switch (response.status) {
        case 200:
          deleteToken();
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Account Deleted Succesfully!",
              details:
                "We are sorry to see you go. Your account has been deleted sucessfully. Continue to keep on the healthy lifestyle.",
              label: "Home",
              redirectionRoute: "/",
            })
          );
        case 401:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Email Missmatch!",
              details:
                "The email you have provided does not match your currant one. If you still want to delete your account try again with another one.",
              label: "Try again",
              redirectionRoute: ".",
            })
          );
        case 404:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "User not found!",
              details:
                "It seems like you made your request for account deletiong from a link that is not valid. Please try again with a newly generated one and if you continue to experience this issue please reach out.",
              label: "Log In",
              redirectionRoute: "/auth/login",
            })
          );
        default:
        case 500:
          return dispatch(
            setErrorModalState({
              visibility: true,
              responseCode: response.status,
              title: "Internal Server Error!",
              details:
                "It is not you, it is us! Something went wrong with the process of deleting your account. Please try again and if you continue to experience this issue please reach out!",
              label: "Log In",
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
    <form onSubmit={onSubmitHandler}>
      <header className={inheritedStyles["header-wrapper"]}>
        <h3 style={{ color: "#d90429" }}>Delete Account</h3>
        <p style={{ fontWeight: "500" }}>
          {expired
            ? "Your delete account link has expired. Please log in and make a new one if you still want to proceed with the deletion of your account."
            : "Keep in mind that this process is inreversable. All your data will be lost and you won't be able to restore it. If you are certain that you want to delete your account, please type your email once again."}
        </p>
      </header>
      <p className={inheritedStyles.divider}>agreement</p>
      {!expired && (
        <div className={inheritedStyles.inputs}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            autoComplete="off"
            onKeyDown={preventEnter}
          />
          {emailErrorState && (
            <p className={inheritedStyles["error-message"]}>
              Provide a valid email!
            </p>
          )}
        </div>
      )}
      <button
        type="submit"
        className={inheritedStyles["submit-button"]}
        disabled={expired ? false : !emailValidationStatus}
        style={expired ? undefined : { backgroundColor: "#d90429" }}
      >
        {expired ? "Take me back" : "Delete Account"}
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

export default DeleteAccount;
