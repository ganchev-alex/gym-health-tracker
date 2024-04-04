import { useLoaderData, useNavigate } from "react-router-dom";

import { mainAPIPath } from "../../../App";

import inheritedStyles from "./SignInForm.module.css";

const EmailVerification = function () {
  const navigate = useNavigate();
  const verified = useLoaderData() as boolean;

  const isMale = localStorage.getItem("userSex");

  return (
    <form>
      <header className={inheritedStyles["header-wrapper"]}>
        <h3>Email Verification</h3>
        <p>
          {verified
            ? "You have succesfully verified your email."
            : "Your verification link has expired. Please log in again and request a new one."}
        </p>
      </header>
      <p className={inheritedStyles.divider}>take me back</p>
      <button
        type="submit"
        className={`${inheritedStyles["submit-button"]} ${
          isMale === "female" ? inheritedStyles.female : inheritedStyles.male
        }`}
        onClick={() => {
          navigate("/auth/login");
        }}
      >
        Log In
      </button>
    </form>
  );
};

export default EmailVerification;

export const verificationLoader = async function ({ params }: any) {
  const userId = params.userId;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const expiration = urlParams.get("expiration");

    if (!expiration) {
      return false;
    }

    if (new Date(expiration) < new Date()) {
      return false;
    }

    const response = await fetch(
      `${mainAPIPath}/account/verify?userId=${userId}`
    );

    switch (response.status) {
      case 200:
        return true;
      case 404:
      case 500:
        return false;
    }
  } catch {
    return false;
  }
};
