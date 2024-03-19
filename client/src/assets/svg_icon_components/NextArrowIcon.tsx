import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

const NextArrowIcon = function () {
  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 480 480"
      fill="none"
    >
      <path
        d="M480 240C480 107.456 372.544 -4.69705e-06 240 -1.04907e-05C107.456 -1.62844e-05 -4.69705e-06 107.456 -1.04907e-05 240C-1.62844e-05 372.544 107.456 480 240 480C372.544 480 480 372.544 480 240ZM197.568 347.584L197.632 347.52C194.208 344.992 192 341.44 192 337.44L192 141.92C192 137.984 194.08 134.464 197.408 131.936C197.472 131.904 197.504 131.84 197.568 131.776C204.512 126.336 215.776 126.336 222.72 131.776L346.144 229.536C346.336 229.664 346.592 229.728 346.784 229.888C353.728 235.328 353.728 244.192 346.784 249.632L222.72 347.616C215.776 353.056 204.512 353.056 197.568 347.584Z"
        fill={isMale ? "#472ed8" : "#e54c60"}
      />
    </svg>
  );
};

export default NextArrowIcon;
