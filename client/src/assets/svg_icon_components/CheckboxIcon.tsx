import { useSelector } from "react-redux";
import { RootState } from "../../features/store";

const CheckBoxIcon: React.FC<{ checkState: boolean }> = function (props) {
  const { isMale } = useSelector((state: RootState) => state.userActions);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <rect x="1" y="1" width="28" height="27" rx="13.5" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 15C30 22.071 30 25.6067 27.8032 27.8033C25.6066 30 22.071 30 15 30C7.92893 30 4.39339 30 2.1967 27.8033C-2.38419e-07 25.6067 0 22.071 0 15C0 7.92892 -2.38419e-07 4.39339 2.1967 2.1967C4.39339 -2.44238e-07 7.92893 0 15 0C22.071 0 25.6066 -2.44238e-07 27.8032 2.1967C30 4.39339 30 7.92892 30 15ZM23.1818 7.35514C23.676 7.73169 23.7714 8.43757 23.3949 8.93179L13.1091 22.4318C12.9044 22.7006 12.5895 22.8631 12.2517 22.8744C11.914 22.8856 11.5891 22.7445 11.3668 22.4898L6.65251 17.0898C6.2439 16.6218 6.29208 15.9111 6.76014 15.5025C7.22819 15.0939 7.93887 15.1421 8.34748 15.6102L12.155 19.9714L21.6051 7.56821C21.9818 7.07399 22.6877 6.97858 23.1818 7.35514Z"
        fill={`${
          props.checkState ? (isMale ? "#472ED8" : "#E54C60") : "#828282"
        }`}
      />
    </svg>
  );
};

export default CheckBoxIcon;
