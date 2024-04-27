import { useNavigate } from "react-router-dom";

import inheritedStyles from "./SignInForm.module.css";

const ChangeEmail = function () {
  const navigate = useNavigate();

  return (
    <form>
      <header className={inheritedStyles["header-wrapper"]}>
        <h3>Email Change Up</h3>
        <p>Provide a new email that later on you will have to verify.</p>
      </header>
      <p className={inheritedStyles.divider}>new email</p>
      <button
        type="submit"
        className={inheritedStyles["submit-button"]}
        onClick={() => navigate("/auth/login")}
      >
        Log In
      </button>
    </form>
  );
};

export default ChangeEmail;
