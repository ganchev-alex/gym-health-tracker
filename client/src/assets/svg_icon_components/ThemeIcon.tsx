import React from "react";

const ThemeIcon: React.FC<{ selectedTheme: boolean }> = (props) => {
  const selectedIcon = props.selectedTheme ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="31"
      height="31"
      viewBox="0 0 31 31"
      fill="none"
    >
      <path
        d="M15.4759 24.221C20.2625 24.1902 24.1176 20.2612 24.0866 15.4452C24.0556 10.6294 20.1502 6.75029 15.3637 6.78111C10.5771 6.81193 6.72204 10.741 6.75304 15.5568C6.78405 20.3728 10.6894 24.2518 15.4759 24.221Z"
        stroke="#828282"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.0016 25.0183L24.8272 24.845M24.7061 6.03677L24.8783 5.86126M5.96142 25.1409L6.13363 24.9653M15.3342 2.19311L15.3335 2.08578M15.5062 28.9163L15.5055 28.809M2.19304 15.5862L2.08637 15.5869M28.7533 15.4152L28.6467 15.4159M6.01254 6.15713L5.83808 5.98385"
        stroke="#828282"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M4.47249 5.84459C2.7574 8.02537 1.81466 10.8195 2.03047 13.8408C2.43937 19.6903 7.40292 24.4494 13.3432 24.7107C17.5344 24.8924 21.2827 22.9388 23.5316 19.8607C24.463 18.5999 23.9632 17.7594 22.4071 18.0434C21.6461 18.1797 20.8624 18.2365 20.0446 18.2024C14.4904 17.9752 9.94716 13.3297 9.92445 7.84364C9.91309 6.36707 10.2198 4.97 10.7763 3.69788C11.3896 2.28946 10.6514 1.61932 9.23159 2.22131"
        stroke="#828282"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return selectedIcon;
};

export default ThemeIcon;
